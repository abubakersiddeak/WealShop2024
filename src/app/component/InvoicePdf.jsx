// components/InvoicePDF.js
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    color: "#333",
  },
  headerContainer: {
    marginBottom: 25,
    borderBottomWidth: 2,
    borderBottomColor: "#2E86C1",
    paddingBottom: 12,
  },
  shopName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1B4F72",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 4,
  },
  domain: {
    fontSize: 12,
    color: "#2874A6",
    textAlign: "center",
    marginBottom: 2,
  },
  contact: {
    fontSize: 12,
    color: "#2874A6",
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2E86C1",
    paddingBottom: 4,
    color: "#2E86C1",
  },
  text: {
    marginBottom: 4,
    lineHeight: 1.4,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#2E86C1",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
  },
  tableCell: {
    fontSize: 11,
    color: "#fff",
  },
  tableCellBody: {
    fontSize: 11,
    color: "#333",
  },
  totalSection: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#999",
    paddingTop: 10,
    textAlign: "right",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1B4F72",
  },
  paymentSection: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#f2f4f7",
    borderRadius: 6,
  },
  paymentText: {
    marginBottom: 6,
  },
  footer: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
  },
  footerLink: {
    color: "#2874A6",
    textDecoration: "underline",
  },
});

const Invoicepdf = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header with shop info */}
      <View style={styles.headerContainer}>
        <Text style={styles.shopName}>Weal</Text>
        <Text style={styles.domain}>www.wealbd.com</Text>
        <Text style={styles.contact}>Contact: 01403-000212</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Invoice Details</Text>
        <Text style={styles.text}>Invoice ID: {order._id}</Text>
        <Text style={styles.text}>
          Date: {new Date(order.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Customer Information</Text>
        <Text style={styles.text}>Name: {order.customer.name}</Text>
        <Text style={styles.text}>Email: {order.customer.email}</Text>
        <Text style={styles.text}>Phone: {order.customer.phone}</Text>
        <Text style={styles.text}>
          Address: {order.shipping.address}, {order.shipping.city} -{" "}
          {order.shipping.postal_code}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Order Summary</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Product</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Size</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Qty</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Unit salePrice</Text>
            </View>
          </View>
          {order.items.map((item, index) => (
            <View
              style={[
                styles.tableRow,
                { backgroundColor: index % 2 === 0 ? "#f7f9fc" : "#fff" },
              ]}
              key={index}
            >
              <View style={styles.tableCol}>
                <Text style={styles.tableCellBody}>{item.name}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellBody}>{item.size || "N/A"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellBody}>{item.quantity}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellBody}>
                  TK {item.salePrice.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.totalSection}>
        <Text style={styles.totalText}>
          Grand Total: TK{" "}
          {order.items
            .reduce((total, item) => total + item.salePrice * item.quantity, 0)
            .toFixed(2)}
        </Text>
      </View>

      <View style={styles.paymentSection}>
        <Text style={[styles.subtitle, { marginBottom: 10 }]}>
          Payment Details
        </Text>
        <Text style={styles.paymentText}>Transaction ID: {order._id}</Text>
        <Text style={styles.paymentText}>Status: {order.payment_status}</Text>
        <Text style={styles.paymentText}>
          Amount Paid: TK{" "}
          {order.items
            .reduce((total, item) => total + item.salePrice * item.quantity, 0)
            .toFixed(2)}
        </Text>
        <Text style={styles.paymentText}>
          Payment Method: {order.card_type}
        </Text>
      </View>

      {/* Footer with facebook link */}
      <View style={styles.footer}>
        <Text>Follow us on Facebook: </Text>
        <Link
          style={styles.footerLink}
          src="https://www.facebook.com/wealbd2024"
        >
          https://www.facebook.com/wealbd2024
        </Link>
      </View>
    </Page>
  </Document>
);

export default Invoicepdf;
