import { FlatList, Modal, Pressable, SafeAreaView, StyleSheet, Text, View, Alert } from 'react-native'
import React, { useState } from 'react'
import { heightToDp, widthToDp } from '../Theme/Dimensions';
import Header from '../Components/Header';
import SimpleCard from '../Components/SimpleCard';
import ProductsCard from '../Components/ProductsCard';
import DynamicForm from '../Components/DynamicForm';
import { useApp } from '../Context/AppContext';
import { productFields, ManagementTabs } from '../Constants/Contants';
import { useLang } from '../Context/TranslationContext';

const ManageProducts = () => {
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const { productsData = [], UpdateProductsData, RemoveProduct, AddProduct, oilsData = [] } = useApp();
    const { t } = useLang();

    const handleAddProduct = () => {
        setEditingProduct(null);
        setShowFormModal(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowFormModal(true);
    };

    const handleFormSubmit = (formData) => {
        if (editingProduct) {
            UpdateProductsData(editingProduct.id, formData);
        } else {
            const newProduct = { id: Date.now(), ...formData };
            AddProduct(newProduct);
        }
        setShowFormModal(false);
        setEditingProduct(null);
    };

    const handleFormCancel = () => {
        setShowFormModal(false);
        setEditingProduct(null);
    };

    const handleDeleteProduct = (productId) => {
        Alert.alert(
            t("deleteProductTitle"),
            t("deleteProductMessage"),
            [
                { text: t("cancel"), style: "cancel" },
                { text: t("delete"), style: "destructive", onPress: () => RemoveProduct(productId) }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title={t(`${ManagementTabs[1].key}`)} />

            <View style={styles.contentContainer}>
                <SimpleCard
                    title={t(`${ManagementTabs[1].key}`)}
                    onPress={handleAddProduct}
                    data={productsData || []}
                />

                <View style={styles.listContainer}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.flatListContent}
                        data={productsData || []}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>{t("noProducts")}</Text>
                                <Text style={styles.emptySubtext}>
                                    {t("addFirstProduct")}
                                </Text>
                            </View>
                        }
                        renderItem={({ item, index }) => (
                            <ProductsCard
                                item={item}
                                key={index}
                                onEdit={() => handleEditProduct(item)}
                                onDelete={() => handleDeleteProduct(item.id)}
                            />
                        )}
                    />
                </View>
            </View>

            {/* Product Form */}
            <Modal
                visible={showFormModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={handleFormCancel}
            >
                <DynamicForm
                    title={editingProduct ? t("editProduct") : t("addProduct")}
                    fields={productFields}
                    initialData={editingProduct || {}}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    submitText={editingProduct ? t("updateProduct") : t("saveProduct")}
                    isEdit={!!editingProduct}
                    showIngredientsForm={true}
                    availableOils={oilsData || []}
                    autoCompletePercentage={true}
                />
            </Modal>
        </SafeAreaView>
    )
}

export default ManageProducts

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "white" },
    contentContainer: { flex: 1, paddingHorizontal: widthToDp(5), paddingVertical: heightToDp(5) },
    listContainer: { flex: 1, marginVertical: heightToDp(2) },
    flatListContent: { rowGap: 12, paddingVertical: heightToDp(3), paddingBottom: heightToDp(20) },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: heightToDp(10) },
    emptyText: { fontSize: 18, fontWeight: '600', color: '#6b7280', marginBottom: 8 },
    emptySubtext: { fontSize: 14, color: '#9ca3af', textAlign: 'center' }
})
