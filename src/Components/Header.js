import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { heightToDp, widthToDp } from '../Theme/Dimensions'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useLang } from '../Context/TranslationContext';

const Header = ({ title }) => {
    const navigation = useNavigation();
    const { t } = useLang();

    return (
        <View style={{
            gap: 20,
            flexDirection: "row",
            alignItems: 'center',
            paddingHorizontal: widthToDp(5),
            elevation: 10,
            backgroundColor: "white",
            paddingVertical: heightToDp(5),
            paddingTop: heightToDp(12)
        }}>
            <Pressable onPress={() => { navigation.goBack() }}>
                <MaterialIcons name="arrow-back-ios" size={24} color="black" />
            </Pressable>
            <View>
                <Text style={{ color: "black", fontWeight: "bold", fontSize: 25 }}>
                    {title}
                </Text>
                <Text>
                    {t("ManageDetails", { title })}
                </Text>
            </View>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({})
