import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { heightToDp, widthToDp } from '../Theme/Dimensions'
import { useLang } from '../Context/TranslationContext'

const OilsCard = ({ ...props }) => {
    const { t } = useLang();


    return (
        <View style={{
            paddingVertical: heightToDp(5),
            gap: heightToDp(5),
            paddingHorizontal: widthToDp(5),
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: "#b4b9c2ff",
            backgroundColor: "white"
        }}>
            {/* Oil Info */}
            <View style={{ justifyContent: 'space-around', flexDirection: "column" }}>
                <Text style={{ fontSize: 20, fontWeight: '600' }}>
                    {`${t("name")}: ${props?.item?.title}`}
                </Text>
                <Text style={{ fontSize: 16, color: "#16a34a", fontWeight: "600" }}>
                    {`${t("price")}: ${props?.item?.price}/${props?.item?.unit || "Kg"}`}
                </Text>
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
        </View>
    )
}

export default OilsCard

const styles = StyleSheet.create({
    actionContainer: {
        flexDirection: "row",
        gap: 12
    },
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
    buttonText: {
        color: "white",
        fontSize: 15,
        fontWeight: "600"
    }
})
