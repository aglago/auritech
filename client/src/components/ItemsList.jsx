import React from "react";

const ItemsList = ({
  formData,
  handleItemChange,
  removeItem,
  addItem,
  errors,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Items</h2>
      {formData.items.map((item, index) => (
        <div key={index} className="mb-4 bg-white shadow-md rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="col-span-1 sm:col-span-2 lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  handleItemChange(index, "description", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Price
              </label>
              <input
                type="number"
                placeholder="Unit Price"
                value={item.unitPrice}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "unitPrice",
                    parseFloat(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount
              </label>
              <input
                type="number"
                placeholder="Discount"
                value={item.discount}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "discount",
                    parseFloat(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md transition duration-300"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition duration-300 mt-4"
      >
        Add Item
      </button>
      {errors.items && typeof errors.items === "string" && (
        <p className="text-red-500 text-sm mt-2">{errors.items}</p>
      )}
    </div>
  );
};

export default ItemsList;
