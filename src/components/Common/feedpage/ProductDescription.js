import React, { useMemo, useState, useEffect } from "react";
import he from "he";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useDynamicContent } from "@/hooks";

const parseSpecifications = (details) => {
  if (!details) return [];
  
  // Check if it's a table structure
  if (/<tr/i.test(details)) {
    const rows = [];
    // Match table rows, including those with tbody
    const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gis;
    let match;
    
    while ((match = rowRegex.exec(details))) {
      const rowContent = match[1];
      // Match all td elements in the row
      const cellRegex = /<td[^>]*>(.*?)<\/td>/gis;
      const cells = [];
      let cellMatch;
      
      while ((cellMatch = cellRegex.exec(rowContent))) {
        // Remove all HTML tags but keep the text content
        const cellText = cellMatch[1]
          .replace(/<[^>]+>/g, "") // Remove all HTML tags
          .trim();
        if (cellText) {
          cells.push(he.decode(cellText));
        }
      }
      
      // If we have at least 2 cells (key and value), add the row
      if (cells.length >= 2) {
        rows.push({ 
          key: cells[0], 
          value: cells.slice(1).join(" ") // Join multiple cells if there are more than 2
        });
      }
    }
    
    if (rows.length) return rows;
  }
  
  // Fallback: parse as plain text with line breaks
  return details
    .split(/<br\s*\/?>|\n/)
    .map((line) => {
      const [key, ...rest] = line.split(/:|：/);
      if (rest.length) {
        return {
          key: he.decode(key.trim()),
          value: he.decode(rest.join(":").trim()),
        };
      }
      return null;
    })
    .filter(Boolean);
};

const ProductDescription = ({ product }) => {
  const [showAllRows, setShowAllRows] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Get dynamic content based on current language
  const productDetails = useDynamicContent(product, "details");
console.log("productDetails", productDetails);
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Bootstrap's mobile breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const decodedDetails = useMemo(
    () => (productDetails ? he.decode(productDetails) : ""),
    [productDetails]
  );
console.log("decodedDetails", decodedDetails);
  const specRows = useMemo(
    () => (decodedDetails ? parseSpecifications(decodedDetails) : []),
    [decodedDetails]
  );
console.log("specRows", specRows);
  // Find and separate description row
  const descriptionRow = specRows.find(
    (row) => row.key.toLowerCase() === "description"
  );
  const tableRows = descriptionRow
    ? specRows.filter((row) => row.key.toLowerCase() !== "description")
    : specRows;

  // Determine which rows to show
  const rowsToShow = useMemo(() => {
    if (!isMobile || showAllRows || tableRows.length <= 3) {
      return tableRows;
    }
    return tableRows.slice(0, 3);
  }, [isMobile, showAllRows, tableRows]);

  const shouldShowReadMore = isMobile && tableRows.length > 3;

  const toggleReadMore = () => {
    setShowAllRows(!showAllRows);
  };

  return (
    <div className="w-full overflow-hidden mt-1 sm:mt-6">
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-black mb-3">
          Product Details
        </h2>
        {rowsToShow.length > 0 ? (
          <>
            <table className="w-full border-collapse">
              <tbody>
                {rowsToShow.map((row, i) => (
                  <tr key={`${row.key}-${i}`} className="border-0">
                    <td
                      className="px-3 py-2 font-medium text-gray-600 w-1/3 border-0 align-top"
                      style={{ width: "33.333%" }}
                    >
                      {row.key}
                    </td>
                    <td className="px-3 py-2 text-gray-900 border-0 align-top">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {shouldShowReadMore && (
              <button
                onClick={toggleReadMore}
                className="text-blue-600 hover:underline p-0 flex justify-center w-full mt-2 text-sm"
                type="button"
              >
                {showAllRows ? (
                  <>
                    Show Less <MdKeyboardDoubleArrowUp className="ml-1" />
                  </>
                ) : (
                  <>
                    Read More <MdKeyboardDoubleArrowDown className="ml-1" />
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          decodedDetails && (
            <div
              className="text-sm text-gray-600 mb-4"
              dangerouslySetInnerHTML={{ __html: decodedDetails }}
            />
          )
        )}
      </div>

      {descriptionRow && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Description
          </h2>
          <div
            className="text-sm text-gray-600"
            dangerouslySetInnerHTML={{ __html: descriptionRow.value }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDescription;
