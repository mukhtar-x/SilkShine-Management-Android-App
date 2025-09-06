import { Alert, FlatList, Modal, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { heightToDp, widthToDp } from '../Theme/Dimensions';
import Header from '../Components/Header';
import OilsCard from '../Components/OilsCard';
import SimpleCard from '../Components/SimpleCard';
import DynamicForm from '../Components/DynamicForm';
import { useApp } from '../Context/AppContext';
import { oilFields, ManagementTabs } from '../Constants/Contants';
import { useLang } from '../Context/TranslationContext';

const ManageOils = () => {
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingOil, setEditingOil] = useState(null);

    const { oilsData = [], UpdateOilsData, RemoveOil, AddOil } = useApp();
    const { t } = useLang();

    const handleAddOil = () => {
        setEditingOil(null);
        setShowFormModal(true);
    };

    const handleEditOil = (oil) => {
        setEditingOil(oil);
        setShowFormModal(true);
    };

    const handleFormSubmit = (formData) => {
        if (editingOil) {
            UpdateOilsData(editingOil.id, formData);
        } else {
            const newOil = { id: Date.now(), ...formData };
            AddOil(newOil);
        }
        setShowFormModal(false);
        setEditingOil(null);
    };

    const handleFormCancel = () => {
        setShowFormModal(false);
        setEditingOil(null);
    };

    const handleDeleteOil = (oilId) => {
        Alert.alert(
            t("deleteOilTitle"),
            t("deleteOilMessage"),
            [
                { text: t("cancel"), style: "cancel" },
                { text: t("delete"), style: "destructive", onPress: () => RemoveOil(oilId) }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title={t(`${ManagementTabs[0].key}`)} />

            <View style={styles.contentContainer}>
                <SimpleCard
                    title={t(`${ManagementTabs[0].key}`)}
                    onPress={handleAddOil}
                    data={oilsData || []}
                />

                <View style={styles.listContainer}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.flatListContent}
                        data={oilsData}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>{t("noOilsFound")}</Text>
                                <Text style={styles.emptySubtext}>
                                    {t("addFirstOil")}
                                </Text>
                            </View>
                        }
                        renderItem={({ item, index }) => (
                            <OilsCard
                                item={item}
                                key={index}
                                onEdit={() => handleEditOil(item)}
                                onDelete={() => handleDeleteOil(item.id)}
                            />
                        )}
                    />
                </View>
            </View>

            {/* Dynamic Form Modal */}
            <Modal
                visible={showFormModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={handleFormCancel}
            >
                <DynamicForm
                    title={editingOil ? t("editOil") : t("addNewOil")}
                    fields={oilFields}
                    initialData={editingOil || {}}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    submitText={editingOil ? t("updateOil") : t("addOil")}
                    isEdit={!!editingOil}
                />
            </Modal>
        </SafeAreaView>
    )
}

export default ManageOils

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "white" },
    contentContainer: { flex: 1, paddingHorizontal: widthToDp(5), paddingVertical: heightToDp(5) },
    listContainer: { flex: 1, marginVertical: heightToDp(2) },
    flatListContent: { rowGap: 12, paddingVertical: heightToDp(3), paddingBottom: heightToDp(20) },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: heightToDp(10) },
    emptyText: { fontSize: 18, fontWeight: '600', color: '#6b7280', marginBottom: 8 },
    emptySubtext: { fontSize: 14, color: '#9ca3af', textAlign: 'center' }
})
