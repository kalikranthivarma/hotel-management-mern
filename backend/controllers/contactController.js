import ContactMessage from "../models/ContactMessage.js";
import sendEmail from "../utils/sendEmail.js";

// @desc    Create a contact message
// @route   POST /api/contact
// @access  Public
const createContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone = "", subject, message } = req.body;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      res.status(400);
      throw new Error("Name, email, subject, and message are required");
    }

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
    };

    if (req.user?.role === "guest") {
      payload.user = req.user._id;
    }

    const contactMessage = await ContactMessage.create(payload);

    // Send auto-responder email to guest
    try {
      console.log(`Attempting auto-responder for: ${payload.email}`);
      await sendEmail({
        email: payload.email,
        subject: "We've received your message - KNSU Stays",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;border:1px solid #e5ded6;padding:24px;border-radius:16px;background:#fffdf9;">
            <p style="margin:0 0 12px;color:#9b7b56;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
              KNSU Stays
            </p>
            <h2 style="margin:0 0 18px;color:#1c1c1c;">Thank you for contacting us</h2>
            <p style="margin:0 0 16px;color:#4b5563;">Hello ${payload.name},</p>
            <p style="margin:0 0 16px;color:#4b5563;">We have received your message regarding <strong>"${payload.subject}"</strong>. Our team is reviewing your request and will get back to you shortly.</p>
            <div style="margin:20px 0;padding:18px;border-radius:14px;background:#f7f3ee;color:#6b7280;line-height:1.7;font-style:italic;">
              "${payload.message}"
            </div>
            <p style="margin:20px 0 0;color:#6b7280;">Best Regards,<br />Concierge Team<br />KNSU Stays</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Auto-responder email failed:", emailError);
      // Don't fail the request if auto-responder fails
    }

    res.status(201).json({
      success: true,
      message: "Contact message submitted successfully",
      contactMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = async (req, res, next) => {
  try {
    const contactMessages = await ContactMessage.find({})
      .populate("user", "firstName lastName email")
      .populate("replies.repliedBy", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contactMessages.length,
      contactMessages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to a contact message
// @route   POST /api/contact/:id/reply
// @access  Private/Admin
const replyToContactMessage = async (req, res, next) => {
  try {
    const { replyMessage } = req.body;

    if (!replyMessage?.trim()) {
      res.status(400);
      throw new Error("Reply message is required");
    }

    const contactMessage = await ContactMessage.findById(req.params.id);

    if (!contactMessage) {
      res.status(404);
      throw new Error("Contact message not found");
    }

    const adminName =
      `${req.user?.firstName || ""} ${req.user?.lastName || ""}`.trim() ||
      req.user?.email ||
      "KNSU Team";

    const safeOriginalMessage = contactMessage.message
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br />");

    const safeReplyMessage = replyMessage
      .trim()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br />");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;border:1px solid #e5ded6;padding:24px;border-radius:16px;background:#fffdf9;">
        <p style="margin:0 0 12px;color:#9b7b56;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
          KNSU Stays Support
        </p>
        <h2 style="margin:0 0 18px;color:#1c1c1c;">Reply to your contact request</h2>
        <p style="margin:0 0 16px;color:#4b5563;">Hello ${contactMessage.name},</p>
        <p style="margin:0 0 16px;color:#4b5563;">Our team has reviewed your message and sent the reply below.</p>
        <div style="margin:20px 0;padding:18px;border-radius:14px;background:#f7f3ee;color:#1f2937;line-height:1.7;">
          ${safeReplyMessage}
        </div>
        <div style="margin-top:20px;padding-top:18px;border-top:1px solid #ece5dc;">
          <p style="margin:0 0 8px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.14em;">Your original message</p>
          <div style="color:#6b7280;line-height:1.7;">${safeOriginalMessage}</div>
        </div>
        <p style="margin:20px 0 0;color:#6b7280;">Regards,<br />${adminName}<br />KNSU Stays</p>
      </div>
    `;

    console.log(`Admin is replying to contact message ${contactMessage._id}. Sending email to: ${contactMessage.email}`);

    await sendEmail({
      email: contactMessage.email,
      subject: `Re: ${contactMessage.subject}`,
      html,
    });

    contactMessage.replies.push({
      message: replyMessage.trim(),
      repliedBy: req.user._id,
      repliedByName: adminName,
    });
    contactMessage.status = "reviewed";

    await contactMessage.save();
    await contactMessage.populate("replies.repliedBy", "firstName lastName email");

    res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      contactMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact message status
// @route   PATCH /api/contact/:id/status
// @access  Private/Admin
const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["new", "reviewed", "closed"].includes(status)) {
      res.status(400);
      throw new Error("Invalid status");
    }

    const contactMessage = await ContactMessage.findById(req.params.id);

    if (!contactMessage) {
      res.status(404);
      throw new Error("Contact message not found");
    }

    contactMessage.status = status;
    await contactMessage.save();
    await contactMessage.populate("user", "firstName lastName email");
    await contactMessage.populate("replies.repliedBy", "firstName lastName email");

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      contactMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContactMessage = async (req, res, next) => {
  try {
    const contactMessage = await ContactMessage.findById(req.params.id);

    if (!contactMessage) {
      res.status(404);
      throw new Error("Contact message not found");
    }

    await contactMessage.deleteOne();

    res.status(200).json({
      success: true,
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  createContactMessage,
  getContactMessages,
  replyToContactMessage,
  updateContactStatus,
  deleteContactMessage,
};

