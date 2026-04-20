import { useEffect, useState } from "react";
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItems,
  updateMenuItem,
} from "../api/menuApi";
import Loader from "../components/Loader";
import api from "../api/axios";

const emptyFormData = {
  name: "",
  description: "",
  price: "",
  category: "Appetizer",
  dietaryInfo: [],
  isAvailable: true,
  isSignatureDish: false,
  imageFile: null,
};

const categoryOptions = [
  "Appetizer",
  "Main Course",
  "Dessert",
  "Beverage",
  "Salad",
  "Soup",
  "Chef Specials",
];

const dietaryOptions = ["Veg", "Non-Veg", "Vegan", "Gluten-Free", "Spicy"];

const inputClass =
  "mt-2 w-full rounded-2xl border border-luxe-border bg-luxe-smoke px-4 py-3 outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/10";

const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&q=80";
  if (imagePath.startsWith("http")) return imagePath;
  const baseUrl = api.defaults.baseURL?.replace(/\/api$/, "") || "";
  return `${baseUrl}${imagePath}`;
};

const AdminMenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(emptyFormData);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const data = await getMenuItems();
      setMenuItems(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error(err);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name || "",
        description: item.description || "",
        price: item.price ?? "",
        category: item.category || "Appetizer",
        dietaryInfo: Array.isArray(item.dietaryInfo) ? item.dietaryInfo : [],
        isAvailable: item.isAvailable ?? true,
        isSignatureDish: item.isSignatureDish ?? false,
        imageFile: null,
      });
    } else {
      setEditingItem(null);
      setFormData(emptyFormData);
    }

    setShowModal(true);
  };

  const buildFormData = () => {
    const payload = new FormData();
    payload.append("name", formData.name.trim());
    payload.append("description", formData.description.trim());
    payload.append("price", String(Number(formData.price)));
    payload.append("category", formData.category);
    payload.append("dietaryInfo", formData.dietaryInfo.join(","));
    payload.append("isAvailable", String(formData.isAvailable));
    payload.append("isSignatureDish", String(formData.isSignatureDish));

    if (formData.imageFile) {
      payload.append("image", formData.imageFile);
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = buildFormData();

      if (editingItem) {
        await updateMenuItem(editingItem._id, payload);
      } else {
        await createMenuItem(payload);
      }

      setShowModal(false);
      setEditingItem(null);
      setFormData(emptyFormData);
      fetchMenuItems();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save menu item.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;

    try {
      await deleteMenuItem(id);
      fetchMenuItems();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete menu item.");
    }
  };

  const toggleDietaryInfo = (value) => {
    setFormData((prev) => ({
      ...prev,
      dietaryInfo: prev.dietaryInfo.includes(value)
        ? prev.dietaryInfo.filter((item) => item !== value)
        : [...prev.dietaryInfo, value],
    }));
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 rounded-[34px] bg-white px-6 py-8 shadow-[0_18px_50px_rgba(28,28,28,0.06)] lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-serif text-5xl leading-none">Menu Management</h1>
          <p className="mt-4 text-lg leading-8 text-luxe-muted">
            Add, update, or remove dishes shown on the dining menu.
          </p>
        </div>
        <button
          className="rounded-full bg-luxe-bronze px-5 py-3 text-sm font-semibold text-white transition hover:bg-luxe-charcoal"
          onClick={() => handleOpenModal()}
        >
          Add Menu Item
        </button>
      </header>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {menuItems.map((item) => (
          <article
            key={item._id}
            className="overflow-hidden rounded-[30px] border border-luxe-border bg-white shadow-[0_18px_50px_rgba(28,28,28,0.06)]"
          >
            <img
              src={getImageUrl(item.image)}
              alt={item.name}
              className="h-52 w-full object-cover"
            />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-luxe-bronze">
                    {item.category}
                  </p>
                  <h2 className="mt-2 font-serif text-3xl leading-none">{item.name}</h2>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Rs. {item.price}</p>
                  <p className="mt-1 text-xs text-luxe-muted">
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-luxe-muted">
                {item.description || "No description added yet."}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {(item.dietaryInfo || []).map((diet) => (
                  <span
                    key={`${item._id}-${diet}`}
                    className="rounded-full bg-luxe-smoke px-3 py-1 text-xs font-semibold text-luxe-charcoal"
                  >
                    {diet}
                  </span>
                ))}
                {item.isSignatureDish ? (
                  <span className="rounded-full bg-luxe-charcoal px-3 py-1 text-xs font-semibold text-white">
                    Signature
                  </span>
                ) : null}
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  className="rounded-full border border-luxe-border px-4 py-2 text-sm font-semibold hover:bg-luxe-smoke"
                  onClick={() => handleOpenModal(item)}
                >
                  Edit
                </button>
                <button
                  className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxe-charcoal/50 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-[0_30px_100px_rgba(28,28,28,0.2)] sm:p-8">
            <h2 className="font-serif text-4xl">{editingItem ? "Edit Menu Item" : "Add Menu Item"}</h2>
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-semibold text-luxe-charcoal">
                  Dish Name
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className={inputClass}
                  />
                </label>

                <label className="block text-sm font-semibold text-luxe-charcoal">
                  Price
                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className={inputClass}
                  />
                </label>

                <label className="block text-sm font-semibold text-luxe-charcoal">
                  Category
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={inputClass}
                  >
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-semibold text-luxe-charcoal">
                  Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, imageFile: e.target.files?.[0] || null })
                    }
                    className={inputClass}
                  />
                </label>

                <label className="block text-sm font-semibold text-luxe-charcoal md:col-span-2">
                  Description
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`${inputClass} min-h-28 resize-y`}
                  />
                </label>

                <div className="md:col-span-2">
                  <span className="text-sm font-semibold text-luxe-charcoal">Dietary Info</span>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {dietaryOptions.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 rounded-full border border-luxe-border bg-luxe-smoke px-4 py-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={formData.dietaryInfo.includes(option)}
                          onChange={() => toggleDietaryInfo(option)}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-3 rounded-[24px] bg-luxe-smoke px-4 py-4 text-sm font-semibold text-luxe-charcoal">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  />
                  Available
                </label>

                <label className="flex items-center gap-3 rounded-[24px] bg-luxe-smoke px-4 py-4 text-sm font-semibold text-luxe-charcoal">
                  <input
                    type="checkbox"
                    checked={formData.isSignatureDish}
                    onChange={(e) =>
                      setFormData({ ...formData, isSignatureDish: e.target.checked })
                    }
                  />
                  Signature Dish
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="rounded-2xl border border-luxe-border px-5 py-3 font-semibold hover:bg-luxe-smoke"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-luxe-bronze px-5 py-3 font-semibold text-white transition hover:bg-luxe-charcoal"
                >
                  {editingItem ? "Update Item" : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminMenuManagement;
