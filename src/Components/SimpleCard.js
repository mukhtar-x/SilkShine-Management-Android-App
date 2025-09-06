import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { widthToDp } from '../Theme/Dimensions'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useLang } from '../Context/TranslationContext'

const SimpleCard = ({ ...props }) => {

  const { t } = useLang();
  return (
    <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ gap: 2 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{props.title}</Text>
        <Text style={{ fontSize: 15, fontWeight: "400" }}>{`${t("Total")} : 0${props?.data?.length || 0}`}</Text>
      </View>
      <Pressable onPress={props?.onPress} style={{ padding: 10, borderRadius: 5, elevation: 2, backgroundColor: "#dbeafe" }}>
        <MaterialCommunityIcons name="plus-circle" size={30} color="#3b82f6" />
      </Pressable>
    </View>
  )
}

export default SimpleCard

const styles = StyleSheet.create({})