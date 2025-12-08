import { Alert, FlatList, Modal, StyleSheet, Text, View } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightToDp, widthToDp } from '../Theme/Dimensions';
import Header from '../Components/Header';
import SimpleCard from '../Components/SimpleCard';
import BottleCard from '../Components/BottleCard';
import DynamicForm from '../Components/DynamicForm';
import { useApp } from '../Context/AppContext';
import { bottleFields, ManagementTabs } from '../Constants/Contants';
import { useLang } from '../Context/TranslationContext';

const ManageBottle = () => {
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingBottle, setEditingBottle] = useState(null);
    const { bottlesData = [], UpdateBottlesData, RemoveBottle, AddBottle, GetBottlesData } = useApp();

    useEffect(() => {
        GetBottlesData();
    },[]);

    const { t } = useLang();

    const handleAddBottle = useCallback(() => {
        setEditingBottle(null);
        setShowFormModal(true);
    }, []);

    const handleEditBottle = useCallback((bottle) => {
        if (!bottle || !bottle.id) return;
        setEditingBottle({ ...bottle }); // clone to avoid direct mutation
        setShowFormModal(true);
    }, []);

    const handleFormSubmit = useCallback((formData) => {
        if (!formData || typeof formData !== 'object') return;

        const sanitizedData = {
            ...formData,
            size: parseFloat(formData.size) || 0,
            price: parseFloat(formData.price) || 0,
            stickerCost: parseFloat(formData.stickerCost) || 0,
            boxCost: parseFloat(formData.boxCost) || 0,
            labourCharges: parseFloat(formData.labourCharges) || 0,
            extraCharges: parseFloat(formData.extraCharges) || 0,
        };

        if (editingBottle && editingBottle.id) {
            UpdateBottlesData(editingBottle.id, sanitizedData);
        } else {
            const newBottle = { id: Date.now(), ...sanitizedData };
            AddBottle(newBottle);
        }


        setShowFormModal(false);
        setEditingBottle(null);
    }, [editingBottle, UpdateBottlesData, AddBottle]);

    const handleFormCancel = useCallback(() => {
        setShowFormModal(false);
        setEditingBottle(null);
    }, []);

    const handleDeleteBottle = useCallback((bottleId) => {
        if (!bottleId) return;

        Alert.alert(
            t("delete_bottle_title"),
            t("delete_bottle_message"),
            [
                { text: t("cancel"), style: "cancel" },
                { text: t("delete"), style: "destructive", onPress: () => RemoveBottle(bottleId) }
            ]
        );
    }, [RemoveBottle, t]);

    return (
         <View style={styles.container}>
            <Header title={t(`${ManagementTabs[2]?.key || 'Bottles'}`)} />

            <View style={styles.contentContainer}>
                <SimpleCard
                    title={t(`${ManagementTabs[2]?.key || 'Bottles'}`)}
                    onPress={handleAddBottle}
                    data={bottlesData}
                />

                <View style={styles.listContainer}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.flatListContent}
                        data={bottlesData}
                        keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>{t("no_bottle_found")}</Text>
                                <Text style={styles.emptySubtext}>{t("add_first_bottle")}</Text>
                            </View>
                        }
                        renderItem={({ item }) =>
                            item && item.id ? (
                                <BottleCard
                                    Bottle={item}
                                    onEdit={() => handleEditBottle(item)}
                                    onDelete={() => handleDeleteBottle(item.id)}
                                />
                            ) : null
                        }
                    />
                </View>
            </View>

            <Modal
                visible={showFormModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={handleFormCancel}
            >
                <DynamicForm
                    title={editingBottle ? t("edit_bottle") : t("add_new_bottle")}
                    fields={bottleFields}
                    initialData={editingBottle || {}}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    submitText={editingBottle ? t("update_bottle") : t("add_bottle")}
                    isEdit={!!editingBottle}
                />
            </Modal>
         </View>
    );
};

export default ManageBottle;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "white" },
    contentContainer: { flex: 1, paddingHorizontal: widthToDp(5), paddingVertical: heightToDp(5) },
    listContainer: { flex: 1, marginVertical: heightToDp(2), marginBottom: heightToDp(10) },
    flatListContent: { rowGap: 12, paddingVertical: heightToDp(3), paddingBottom: heightToDp(20) },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: heightToDp(10) },
    emptyText: { fontSize: 18, fontWeight: '600', color: '#6b7280', marginBottom: 8 },
    emptySubtext: { fontSize: 14, color: '#9ca3af', textAlign: 'center' }
});
