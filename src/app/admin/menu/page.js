"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import AdminSidebar from "@/components/AdminSidebar";
import {
  FaPlus,
  FaTrash,
  FaUtensils,
  FaMapMarkerAlt,
  FaDollarSign,
  FaTag,
} from "react-icons/fa";
import Link from "next/link";

export default function AdminMenu() {
  useRouteGuard(true); // Admin-only route

  const [zones, setZones] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadZones() {
    const snapshot = await getDocs(collection(db, "zones"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setZones(data);
  }

  async function loadMenuItems() {
    const snapshot = await getDocs(collection(db, "menu"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMenuItems(data);
  }

  useEffect(() => {
    loadZones();
    loadMenuItems();
  }, []);

  function validateForm() {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Item name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Item name must be at least 2 characters";
    }

    if (!zoneId) {
      newErrors.zoneId = "Please select a zone";
    }

    if (!price || isNaN(price) || Number(price) <= 0) {
      newErrors.price = "Price must be a positive number";
    } else if (Number(price) > 50) {
      newErrors.price = "Price cannot exceed ₹50";
    }

    if (!category) {
      newErrors.category = "Please select a category";
    }

    if (image && !isValidUrl(image)) {
      newErrors.image = "Please enter a valid image URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  async function createItem(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "menu"), {
        name: name.trim(),
        price: Number(price),
        zoneId,
        image: image.trim(),
        category,
        createdAt: new Date(),
      });

      // Reset form
      setName("");
      setPrice("");
      setZoneId("");
      setImage("");
      setCategory("");
      setErrors({});

      loadMenuItems();
    } catch (error) {
      console.error("Error creating menu item:", error);
      setErrors({ submit: "Failed to create menu item. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteItem(id) {
    if (confirm("Are you sure you want to delete this menu item?")) {
      await deleteDoc(doc(db, "menu", id));
      loadMenuItems();
    }
  }

  const getZoneName = (zoneId) => {
    const zone = zones.find((z) => z.id === zoneId);
    return zone ? zone.name : "Unknown Zone";
  };

  const categories = ["Food", "Beverage", "Snack", "Dessert"];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-100 mb-8">
            Manage Cafe Menu
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="flex items-center">
                <div className="p-3 bg-green-600 rounded-lg">
                  <FaUtensils className="text-white text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-slate-400 text-sm">Total Items</p>
                  <p className="text-2xl font-bold text-slate-100">
                    {menuItems.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="flex items-center">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <FaMapMarkerAlt className="text-white text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-slate-400 text-sm">Zones with Menu</p>
                  <p className="text-2xl font-bold text-slate-100">
                    {new Set(menuItems.map((item) => item.zoneId)).size}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="flex items-center">
                <div className="p-3 bg-purple-600 rounded-lg">
                  <FaTag className="text-white text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-slate-400 text-sm">Categories</p>
                  <p className="text-2xl font-bold text-slate-100">
                    {new Set(menuItems.map((item) => item.category)).size}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="flex items-center">
                <div className="p-3 bg-orange-600 rounded-lg">
                  <FaDollarSign className="text-white text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-slate-400 text-sm">Avg Price</p>
                  <p className="text-2xl font-bold text-slate-100">
                    ₹
                    {menuItems.length > 0
                      ? (
                          menuItems.reduce((sum, item) => sum + item.price, 0) /
                          menuItems.length
                        ).toFixed(2)
                      : "0.00"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Create Menu Item Form */}
          {/* Create Menu Item Dropdown Form */}

          <details className="bg-slate-800 rounded-lg border border-slate-700 mb-8 overflow-hidden group">
            <summary className="flex items-center justify-between cursor-pointer p-6 text-xl font-semibold text-slate-100 list-none hover:bg-slate-700 transition">
              <div className="flex items-center gap-3">
                <FaPlus className="text-green-400" />
                Add New Menu Item
              </div>

              <span className="text-slate-400 group-open:rotate-180 transition-transform duration-300">
                ▼
              </span>
            </summary>

            <div className="p-6 border-t border-slate-700">
              {errors.submit && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
                  {errors.submit}
                </div>
              )}

              <form
                onSubmit={createItem}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Item Name *
                  </label>

                  <input
                    placeholder="Item Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full p-3 bg-slate-700 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.name ? "border-red-500" : "border-slate-600"
                    }`}
                    required
                  />

                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Zone *
                  </label>

                  <select
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                    className={`w-full p-3 bg-slate-700 border rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.zoneId ? "border-red-500" : "border-slate-600"
                    }`}
                    required
                  >
                    <option value="">Select Zone</option>

                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name} - {zone.location}
                      </option>
                    ))}
                  </select>

                  {errors.zoneId && (
                    <p className="text-red-400 text-sm mt-1">{errors.zoneId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Price *
                  </label>

                  <input
                    type="number"
                    placeholder="Price (₹0.01 - ₹50)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={`w-full p-3 bg-slate-700 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.price ? "border-red-500" : "border-slate-600"
                    }`}
                    min="0.01"
                    max="50"
                    step="0.01"
                    required
                  />

                  {errors.price && (
                    <p className="text-red-400 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category *
                  </label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full p-3 bg-slate-700 border rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.category ? "border-red-500" : "border-slate-600"
                    }`}
                    required
                  >
                    <option value="">Select Category</option>

                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  {errors.category && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Image URL
                  </label>

                  <input
                    placeholder="https://example.com/image.jpg"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className={`w-full p-3 bg-slate-700 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.image ? "border-red-500" : "border-slate-600"
                    }`}
                  />

                  {errors.image && (
                    <p className="text-red-400 text-sm mt-1">{errors.image}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 invisible">
                    Submit
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white p-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <FaPlus />

                    {isSubmitting ? "Adding Item..." : "Add Menu Item"}
                  </button>
                </div>
              </form>
            </div>
          </details>

          {/* Menu Items Table */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-slate-100">
                All Menu Items
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="p-4 text-left text-slate-300 font-medium">
                      Item Name
                    </th>
                    <th className="p-4 text-left text-slate-300 font-medium">
                      Zone
                    </th>
                    <th className="p-4 text-left text-slate-300 font-medium">
                      Category
                    </th>
                    <th className="p-4 text-left text-slate-300 font-medium">
                      Price
                    </th>
                    <th className="p-4 text-left text-slate-300 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-slate-700 hover:bg-slate-750"
                    >
                      <td className="p-4 text-slate-100 font-medium">
                        {item.name}
                      </td>
                      <td className="p-4 text-slate-300">
                        <Link
                          href={`/admin/zones/₹{item.zoneId}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                          {getZoneName(item.zoneId)}
                        </Link>
                      </td>
                      <td className="p-4 text-slate-300">{item.category}</td>
                      <td className="p-4 text-slate-300">₹{item.price}</td>
                      <td className="p-4">
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200 flex items-center gap-2"
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
