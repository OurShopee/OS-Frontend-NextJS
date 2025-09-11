import React, { useState, useMemo } from "react";
import { decode } from "html-entities";
import PropTypes from "prop-types";
import ProductForm from "./ProductForm";
import he from "he";

// Helper: Parse HTML or text to key-value pairs
const parseSpecifications = (details) => {
  if (!details) return [];

  // Try to parse as HTML table rows
  if (/<tr/i.test(details)) {
    const rows = [];
    const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gi;
    let match;
    while ((match = rowRegex.exec(details))) {
      const cells = match[1]
        .split(/<\/td>/i)
        .map((cell) => decode(cell.replace(/<[^>]+>/g, "").trim()))
        .filter(Boolean);
      if (cells.length >= 2) rows.push({ key: cells[0], value: cells[1] });
    }
    if (rows.length) return rows;
  }

  // Fallback: parse as key: value lines
  return details
    .split(/<br\s*\/?>|\n/)
    .map((line) => {
      const [key, ...rest] = line.split(/:|：/);
      if (rest.length) {
        return {
          key: decode(key.trim()),
          value: decode(rest.join(":").trim()),
        };
      }
      return null;
    })
    .filter(Boolean);
};

const ProductDetailTabs = ({
  product,
  locationsData,
  queryParams,
  country,
  Webfeed,
}) => {
  const [activeTab, setActiveTab] = useState("form");

  const isOutOfStock = useMemo(() => {
    return (
      product.stock?.toLowerCase() !== "in stock" ||
      !product.display_price ||
      typeof product.display_price !== "number"
    );
  }, [product.stock, product.quantity, product.display_price]);
  const decodedDetails = useMemo(
    () => (product?.details ? he.decode(product.details) : ""),
    [product?.details]
  );

  const specRows = useMemo(
    () => (decodedDetails ? parseSpecifications(decodedDetails) : []),
    [decodedDetails]
  );


  const { descriptionRow, tableRows } = useMemo(() => {
    const descriptionRowIndex = specRows.findIndex(
      (row) => row.key.toLowerCase() === "description"
    );
    const descriptionRow =
      descriptionRowIndex !== -1 ? specRows[descriptionRowIndex] : null;
    const tableRows =
      descriptionRowIndex !== -1
        ? specRows.slice(0, descriptionRowIndex)
        : specRows;

    return { descriptionRow, tableRows };
  }, [specRows]);

  const renderTabContent = () => {
    if (activeTab === "form") {
      if (isOutOfStock) {
        return (
          <div className="text-center text-xl font-semibold text-red-600 p-4 bg-red-50 border border-red-200 rounded-lg">
            Sorry, this product is currently out of stock.
          </div>
        );
      }

      return (
        <ProductForm
          product={product}
          locationsList={locationsData}
          queryParams={queryParams}
          country={country}
          Webfeed={Webfeed}
        />
      );
    }

    return (
      <div>
        {product.name && (
          <div className="w-full pt-3 pb-3 border-t">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Product Details</h2>
            <div
              className="text-sm text-gray-600"
              dangerouslySetInnerHTML={{ __html: product.name }}
            />
          </div>
        )}

        {decodedDetails && (
          <div className="w-full border-t pt-3 mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Specifications</h2>
            {tableRows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {tableRows.map((row, i) => (
                      <tr key={`${row.key}-${i}`} className="border-b border-gray-200 even:bg-gray-50">
                        <td
                          className="px-3 py-2 font-medium text-gray-600 w-1/3"
                        >
                          {row.key}
                        </td>
                        <td className="px-3 py-2 text-gray-900">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            ) : (
              <div
                className="text-sm text-gray-600"
                dangerouslySetInnerHTML={{ __html: decodedDetails }}
              />
            )}

            {descriptionRow && (
              <div className="pt-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <div
                  className="text-sm text-gray-600"
                  dangerouslySetInnerHTML={{ __html: descriptionRow.value }}
                />
              </div>
            )}
          </div>
        )
        }
      </div >
    );
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border overflow-hidden pt-3">
      <div className="flex mx-3 p-1 bg-gray-100 rounded-xl">
        <div className="flex-1 px-1 cursor-pointer">
          <button
            className={`w-full py-2 font-semibold border-0 
        ${activeTab === "form" ? "bg-gray-900 text-white rounded-xl" : "bg-gray-100 text-gray-900"} `}
            onClick={() => setActiveTab("form")}
          >
            Place An Order Request
          </button>
        </div>
        <div className="flex-1 px-1 cursor-pointer">
          <button
            className={`w-full py-2 font-semibold border-0 
        ${activeTab === "description" ? "bg-gray-900 text-white rounded-xl" : "bg-gray-100 text-gray-900"} `}
            onClick={() => setActiveTab("description")}
          >
            Product Description
          </button>
        </div>
      </div>

      <div className="px-4 pt-2 pb-4 md:px-4">{renderTabContent()}</div>
    </div>
  );
};

ProductDetailTabs.propTypes = {
  product: PropTypes.shape({
    stock: PropTypes.string,
    quantity: PropTypes.number,
    display_price: PropTypes.string,
    name: PropTypes.string,
    details: PropTypes.string,
  }).isRequired,
  locationsData: PropTypes.array.isRequired,
  queryParams: PropTypes.object.isRequired,
  country: PropTypes.string.isRequired,
};

export default ProductDetailTabs;