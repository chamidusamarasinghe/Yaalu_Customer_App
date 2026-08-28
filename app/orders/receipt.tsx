import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomBottomTabBar from '../../components/CustomBottomTabBar';

export default function OrderReceiptScreen() {
  const router = useRouter();

  const handleDownloadPDF = () => {
    Alert.alert('Receipt Downloaded', 'The official receipt PDF has been saved to your device.');
  };

  const handleShareReceipt = () => {
    Alert.alert('Share Receipt', 'Receipt link copied to clipboard!');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDB813" />

      {/* Yellow Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={26} color="#0A0E1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Receipt</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.headerBtn} onPress={handleShareReceipt}>
          <Ionicons name="share-social-outline" size={22} color="#0A0E1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Receipt Main Paper Card */}
        <View style={styles.receiptCard}>
          {/* Top Yellow Ribbon Header */}
          <View style={styles.receiptTopHeader}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandTitle}>YAALU</Text>
            </View>
            <View style={styles.paidBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#166534" style={{ marginRight: 4 }} />
              <Text style={styles.paidText}>PAID</Text>
            </View>
          </View>

          <Text style={styles.receiptSubHeader}>OFFICIAL TAX INVOICE</Text>
          <Text style={styles.receiptNo}>Receipt No: #REC-2023-9842</Text>

          <View style={styles.dashedDivider} />

          {/* Metadata Grid */}
          <View style={styles.metaGrid}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Order ID:</Text>
              <Text style={styles.metaValBold}>#YA12345678</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Date & Time:</Text>
              <Text style={styles.metaVal}>7 May 2023, 11:18 AM</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Payment Method:</Text>
              <Text style={styles.metaVal}>Cash on Delivery</Text>
            </View>
          </View>

          <View style={styles.solidDivider} />

          {/* Merchant & Customer Details */}
          <View style={styles.partyDetailsBlock}>
            <View style={styles.partyCol}>
              <Text style={styles.partyHeader}>MERCHANT</Text>
              <Text style={styles.partyName}>Green Mart - Nugegoda</Text>
              <Text style={styles.partySubtext}>Shop Reg: #GM-94021</Text>
            </View>

            <View style={styles.partyCol}>
              <Text style={styles.partyHeader}>DELIVERED TO</Text>
              <Text style={styles.partyName}>Nimal Perera</Text>
              <Text style={styles.partySubtext}>12/3, Flower Road, Colombo 07</Text>
              <Text style={styles.partySubtext}>Driver: Dinesh Perera</Text>
            </View>
          </View>

          <View style={styles.dashedDivider} />

          {/* Items Table Header */}
          <Text style={styles.itemsTableTitle}>ORDER ITEMS</Text>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.thCell, { flex: 2 }]}>Item Description</Text>
            <Text style={[styles.thCell, { flex: 0.8, textAlign: 'center' }]}>Qty</Text>
            <Text style={[styles.thCell, { flex: 1.2, textAlign: 'right' }]}>Price</Text>
            <Text style={[styles.thCell, { flex: 1.2, textAlign: 'right' }]}>Total</Text>
          </View>

          {/* Item Rows */}
          <View style={styles.tableRow}>
            <Text style={[styles.tdCell, { flex: 2, fontWeight: '700' }]}>Red Apple 1kg</Text>
            <Text style={[styles.tdCell, { flex: 0.8, textAlign: 'center' }]}>1</Text>
            <Text style={[styles.tdCell, { flex: 1.2, textAlign: 'right' }]}>650.00</Text>
            <Text style={[styles.tdCellBold, { flex: 1.2, textAlign: 'right' }]}>650.00</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tdCell, { flex: 2, fontWeight: '700' }]}>Banana 1kg</Text>
            <Text style={[styles.tdCell, { flex: 0.8, textAlign: 'center' }]}>1</Text>
            <Text style={[styles.tdCell, { flex: 1.2, textAlign: 'right' }]}>280.00</Text>
            <Text style={[styles.tdCellBold, { flex: 1.2, textAlign: 'right' }]}>280.00</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tdCell, { flex: 2, fontWeight: '700' }]}>Fresh Milk 1L</Text>
            <Text style={[styles.tdCell, { flex: 0.8, textAlign: 'center' }]}>1</Text>
            <Text style={[styles.tdCell, { flex: 1.2, textAlign: 'right' }]}>350.00</Text>
            <Text style={[styles.tdCellBold, { flex: 1.2, textAlign: 'right' }]}>350.00</Text>
          </View>

          <View style={styles.solidDivider} />

          {/* Price Breakdown */}
          <View style={styles.breakdownRow}>
            <Text style={styles.bdLabel}>Items Subtotal</Text>
            <Text style={styles.bdVal}>LKR 1,280.00</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.bdLabel}>Delivery Fee</Text>
            <Text style={styles.bdVal}>LKR 150.00</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.bdLabel}>Convenience Fee</Text>
            <Text style={styles.bdVal}>LKR 60.00</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.bdLabel}>Service Tax / VAT (0%)</Text>
            <Text style={styles.bdVal}>LKR 0.00</Text>
          </View>

          <View style={styles.dashedDivider} />

          {/* Grand Total */}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>TOTAL AMOUNT PAID</Text>
            <Text style={styles.grandTotalValue}>LKR 1,490.00</Text>
          </View>

          <View style={styles.dashedDivider} />

          {/* Barcode Graphic Simulation */}
          <View style={styles.barcodeContainer}>
            <View style={styles.barcodeLinesRow}>
              {[2, 4, 1, 3, 5, 2, 4, 1, 2, 6, 3, 1, 4, 2, 5, 2, 1, 4, 3, 2, 5, 1, 4, 2].map(
                (w, index) => (
                  <View
                    key={index}
                    style={[
                      styles.barcodeLine,
                      { width: w, backgroundColor: index % 2 === 0 ? '#0F172A' : '#FFFFFF' },
                    ]}
                  />
                )
              )}
            </View>
            <Text style={styles.barcodeRefText}>*YA12345678-REC*</Text>
            <Text style={styles.receiptFooterNote}>
              Thank you for shopping with YAALU!{'\n'}For inquiries, contact support@yaalu.lk
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity activeOpacity={0.88} style={styles.downloadBtn} onPress={handleDownloadPDF}>
          <Ionicons name="download-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.downloadBtnText}>Download PDF Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.88} style={styles.shareBtn} onPress={handleShareReceipt}>
          <Ionicons name="share-outline" size={20} color="#061138" style={{ marginRight: 8 }} />
          <Text style={styles.shareBtnText}>Share Receipt</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <CustomBottomTabBar activeTab="ORDERS" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FDB813',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 8 : 44,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  headerBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0A0E1A',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  receiptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  receiptTopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandBadge: {
    backgroundColor: '#FDB813',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0A0E1A',
    letterSpacing: 1.5,
  },
  paidBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paidText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#166534',
  },
  receiptSubHeader: {
    fontSize: 13,
    fontWeight: '900',
    color: '#475569',
    letterSpacing: 1,
    marginTop: 4,
  },
  receiptNo: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  dashedDivider: {
    height: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    marginVertical: 14,
  },
  solidDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  metaGrid: {
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  metaVal: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  metaValBold: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '800',
  },
  partyDetailsBlock: {
    gap: 12,
  },
  partyCol: {},
  partyHeader: {
    fontSize: 11,
    fontWeight: '900',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  partyName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  partySubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  itemsTableTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#475569',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  thCell: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tdCell: {
    fontSize: 13,
    color: '#334155',
  },
  tdCellBold: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '800',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  bdLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  bdVal: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#059669',
  },
  barcodeContainer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  barcodeLinesRow: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    marginBottom: 6,
  },
  barcodeLine: {
    height: '100%',
    marginHorizontal: 1,
  },
  barcodeRefText: {
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 10,
  },
  receiptFooterNote: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
  },
  downloadBtn: {
    backgroundColor: '#061138',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#061138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  shareBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#061138',
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  shareBtnText: {
    color: '#061138',
    fontSize: 16,
    fontWeight: '800',
  },
});
