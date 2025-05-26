"use client";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

import React from "react";
// Register a font for better PDF display if needed (optional)
// You might need to provide a path to a font file or use a CDN
// For simplicity, we'll use a basic font here.
// Example: Font.register({ family: 'Open Sans', src: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf' });

// InvoicePdf Component - This will be rendered inside the PDF

export default function InvoicePdf({
  order,
  tran_id,
  calculateGrandTotal,
  formatDate,
}) {
  // Styles for the PDF document
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#FFFFFF",
      padding: 30,
      fontFamily: "Helvetica", // Or your registered font
    },
    header: {
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#cccccc",
      paddingBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#333333",
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 10,
      color: "#666666",
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      fontSize: 10,
      marginTop: 2,
    },
    section: {
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 10,
      color: "#444444",
    },
    infoText: {
      fontSize: 10,
      marginBottom: 3,
    },
    table: {
      display: "table",
      width: "auto",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#bfbfbf",
      marginBottom: 10,
    },
    tableRow: {
      margin: "auto",
      flexDirection: "row",
    },
    // Adjusted column widths to sum to 100%
    tableColProduct: {
      width: "35%", // Product name
      borderStyle: "solid",
      borderBottomWidth: 1,
      borderColor: "#bfbfbf",
      padding: 5,
    },
    tableColSize: {
      width: "15%", // Size
      borderStyle: "solid",
      borderBottomWidth: 1,
      borderColor: "#bfbfbf",
      padding: 5,
      textAlign: "center", // Center align for size
    },
    tableColQty: {
      width: "10%", // Quantity - slightly reduced
      borderStyle: "solid",
      borderBottomWidth: 1,
      borderColor: "#bfbfbf",
      padding: 5,
      textAlign: "center", // Center align for quantity
    },
    tableColPrice: {
      width: "20%", // Unit Price - increased for clarity
      borderStyle: "solid",
      borderBottomWidth: 1,
      borderColor: "#bfbfbf",
      padding: 5,
      textAlign: "right", // Right align for numbers
    },
    tableColTotal: {
      width: "20%", // Total - increased for clarity
      borderStyle: "solid",
      borderBottomWidth: 1,
      borderColor: "#bfbfbf",
      padding: 5,
      textAlign: "right", // Right align for numbers
    },
    tableCellHeader: {
      margin: "auto", // Keep margin auto for general headers
      fontSize: 10,
      fontWeight: "bold",
    },
    tableCellHeaderRight: {
      // For price/total headers
      fontSize: 10,
      fontWeight: "bold",
      textAlign: "right",
      paddingRight: 2, // Slight padding for header text
    },
    tableCell: {
      margin: "auto", // Keep margin auto for general text cells
      fontSize: 9,
    },
    tableCellRight: {
      // For price/total values
      fontSize: 9,
      textAlign: "right",
      // Removed paddingRight as currency symbol is gone
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 10,
      fontSize: 12,
      fontWeight: "bold",
      color: "#333333",
      paddingRight: 0, // Removed paddingRight as currency symbol is gone
    },
    footer: {
      position: "absolute",
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: "center",
      fontSize: 8,
      color: "#888888",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Weal</Text>
          <Text style={styles.subtitle}>www.wealshop.com</Text>
          <View style={styles.infoRow}>
            <Text>Invoice ID: {order?._id || tran_id}</Text>
            <Text>Date: {formatDate(order?.createdAt)}</Text>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <Text style={styles.infoText}>
            Name: {order?.customer?.name || "-"}
          </Text>
          <Text style={styles.infoText}>
            Email: {order?.customer?.email || "-"}
          </Text>
          <Text style={styles.infoText}>
            Phone: {order?.customer?.phone || "-"}
          </Text>
          <Text style={styles.infoText}>
            Address: {order?.shipping?.address}, {order?.shipping?.city} -{" "}
            {order?.shipping?.postal_code}
          </Text>
        </View>

        {/* Order Summary Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColProduct}>
                <Text style={styles.tableCellHeader}>Product</Text>
              </View>
              <View style={styles.tableColSize}>
                <Text style={styles.tableCellHeader}>Size</Text>
              </View>
              <View style={styles.tableColQty}>
                <Text style={styles.tableCellHeader}>Qty</Text>
              </View>
              <View style={styles.tableColPrice}>
                <Text style={styles.tableCellHeaderRight}>Unit Price</Text>
              </View>
              <View style={styles.tableColTotal}>
                <Text style={styles.tableCellHeaderRight}>Total</Text>
              </View>
            </View>
            {order?.items?.length > 0 ? (
              order.items.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tableColProduct}>
                    <Text style={styles.tableCell}>{item.name}</Text>
                  </View>
                  <View style={styles.tableColSize}>
                    <Text style={styles.tableCell}>{item.size || "N/A"}</Text>
                  </View>
                  <View style={styles.tableColQty}>
                    <Text style={styles.tableCell}>{item.quantity}</Text>
                  </View>
                  <View style={styles.tableColPrice}>
                    <Text style={styles.tableCellRight}>
                      {item.price.toFixed(2)} {/* Removed ৳ */}
                    </Text>
                  </View>
                  <View style={styles.tableColTotal}>
                    <Text style={styles.tableCellRight}>
                      {(item.price * item.quantity).toFixed(2)}{" "}
                      {/* Removed ৳ */}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <View
                  style={{
                    ...styles.tableColProduct,
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <Text style={styles.tableCell}>
                    No items found in this order.
                  </Text>
                </View>
              </View>
            )}
          </View>
          <View style={styles.totalRow}>
            <Text>
              Grand Total: {calculateGrandTotal(order?.items).toFixed(2)}{" "}
              {/* Removed ৳ */}
            </Text>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <Text style={styles.infoText}>Transaction ID: {tran_id || "-"}</Text>
          <Text style={styles.infoText}>
            Status: {order?.payment_status || "N/A"}
          </Text>
          <Text style={styles.infoText}>
            Amount Paid:{" "}
            <Text style={styles.tableCellRight}>
              {calculateGrandTotal(order?.items).toFixed(2)}
            </Text>{" "}
            {/* Removed ৳ */}
          </Text>
          <Text style={styles.infoText}>
            Payment Method: {order?.card_type}
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer} fixed>
          Thank you for shopping with Weal.
        </Text>
      </Page>
    </Document>
  );
}
