import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { heightToDp, widthToDp } from '../Theme/Dimensions'
import { useLang } from '../Context/TranslationContext'

const BottleCard = ({ ...props }) => {
    const { t } = useLang();

    const showBottleDetails = () => {
        const bottle = props?.Bottle;
        const totalCost =
            (bottle?.price || 0) +
            (bottle?.stickerCost || 0) +
            (bottle?.boxCost || 0) +
            (bottle?.labourCharges || 0) +
            (bottle?.extraCharges || 0);

        Alert.alert(
            `${t("bottle_details")} (${bottle?.size || "100g"})`,
            `${t("bottle_price")}: Rs ${bottle?.price || 0}\n` +
            `${t("sticker_cost")}: Rs ${bottle?.stickerCost || 0}\n` +
            `${t("box_cost")}: Rs ${bottle?.boxCost || 0}\n` +
            `${t("labour_charges")}: Rs ${bottle?.labourCharges || 0}\n` +
            `${t("extra_charges")}: Rs ${bottle?.extraCharges || 0}\n` +
            `\n${t("total_cost")}: Rs ${totalCost}`,
            [{ text: t("ok"), style: "default" }]
        );
    };

    const totalPackagingCost =
        (props?.Bottle?.price || 0) +
        (props?.Bottle?.stickerCost || 0) +
        (props?.Bottle?.boxCost || 0) +
        (props?.Bottle?.labourCharges || 0) +
        (props?.Bottle?.extraCharges || 0);

    return (
        <Pressable style={styles.cardContainer} onPress={showBottleDetails}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <Text style={styles.bottleTitle}>
                    {`${t("bottle")} (${props?.Bottle?.size + "kg" || "100kg"})`}
                </Text>
                <View style={styles.tapHint}>
                    <Text style={styles.tapHintText}>{t("tap_for_details")}</Text>
                </View>
            </View>

            {/* Quick Summary */}
            <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{t("size")}:</Text>
                    <Text style={styles.summaryValue}>{props?.Bottle?.size + " kg" || "100kg"}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{t("bottle_price")}:</Text>
                    <Text style={styles.summaryValue}>Rs {props?.Bottle?.price || 0}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>{t("total_cost")}:</Text>
                    <Text style={styles.totalValue}>Rs {totalPackagingCost}</Text>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
                <Pressable onPress={props?.onEdit} style={styles.editButton}>
                    <Text style={styles.buttonText}>{t("edit")}</Text>
                </Pressable>
                <Pressable onPress={props?.onDelete} style={styles.deleteButton}>
                    <Text style={styles.buttonText}>{t("delete")}</Text>
                </Pressable>
            </View>
        </Pressable>
    )
}

export default BottleCard

const styles = StyleSheet.create({
    cardContainer: {
        paddingVertical: heightToDp(3),
        paddingHorizontal: widthToDp(4),
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        backgroundColor: "white",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginVertical: heightToDp(1)
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: heightToDp(2)
    },
    bottleTitle: { fontSize: 18, fontWeight: '700', color: "#1e293b" },
    tapHint: {
        backgroundColor: "#f1f5f9",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6
    },
    tapHintText: { fontSize: 12, color: "#64748b", fontStyle: 'italic' },
    summaryContainer: {
        backgroundColor: "#f8fafc",
        padding: 12,
        borderRadius: 8,
        marginBottom: heightToDp(2),
        gap: 8
    },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    summaryLabel: { fontSize: 15, fontWeight: "500", color: "#475569" },
    summaryValue: { fontSize: 15, fontWeight: "600", color: "#3b82f6" },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#e2e8f0"
    },
    totalLabel: { fontSize: 16, fontWeight: "700", color: "#1e293b" },
    totalValue: { fontSize: 18, fontWeight: "700", color: "#16a34a" },
    actionContainer: { flexDirection: "row", gap: 12 },
    editButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: "#3b82f6",
        borderRadius: 8,
        elevation: 2
    },
    deleteButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: "#dc2626",
        borderRadius: 8,
        elevation: 2
    },
    buttonText: { color: "white", fontSize: 15, fontWeight: "600" }
});
