import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { heightToDp, widthToDp } from '../Theme/Dimensions'
import { useApp } from '../Context/AppContext'
import { useLang } from '../Context/TranslationContext'

const ProductsCard = ({ ...props }) => {
    const { oilsData } = useApp();
    const { t } = useLang();

    const showIngredientDetails = (ingredient) => {
        // Optional: show ingredient details popup
        // Alert.alert(`${t("Name")}: ${ingredient?.oil.title}`, `${t("Percentage")}: ${ingredient.percent}%`)
    };

    const getOilInfo = (id) => {
        return oilsData?.filter(item => item.id == id)[0]?.title || t("Other");
    };

    return (
        <View style={{
            paddingVertical: heightToDp(5),
            gap: heightToDp(3),
            paddingHorizontal: widthToDp(3),
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: "#b4b9c2ff",
            backgroundColor: "white"
        }}>
            <View style={{ justifyContent: 'space-around', flexDirection: "column" }}>
                <Text style={{ fontSize: 20, fontWeight: '600' }}>{props?.item?.title}</Text>
            </View>

            <View style={{ backgroundColor: "#f8fafc", padding: 10, borderRadius: 10 }}>
                <Text style={{ fontSize: 16, color: "#3053ecff", fontWeight: "600" }}>{t("Formula")}</Text>
                <View style={{ gap: 10, flexWrap: "wrap", flexDirection: "row", paddingVertical: heightToDp(2) }}>
                    {props?.item?.ingredients?.map((ingredient, index) => (
                        <Pressable
                            key={index}
                            onPress={() => showIngredientDetails(ingredient)}
                            style={{
                                padding: 10,
                                elevation: 2,
                                gap: 2,
                                backgroundColor: "white",
                                borderRadius: 10,
                                minWidth: widthToDp(38)
                            }}>
                            <Text style={{ color: "black", fontWeight: "600", fontSize: 16 }}>
                                {getOilInfo(ingredient?.oilReference)}
                            </Text>
                            <Text style={{ color: "#3053ecff" }}>{ingredient?.percent + "%"}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>

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

export default ProductsCard

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
