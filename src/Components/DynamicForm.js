import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { heightToDp, widthToDp } from '../Theme/Dimensions'
import CustomButton from './CustomButton'
import CustomTextInput from './CustomTextInput'
import { useLang } from '../Context/TranslationContext'

const DynamicForm = ({
  title = "AddDetails",
  fields = [],
  initialData = {},
  onSubmit = () => { },
  onCancel = () => { },
  submitText = "Save",
  isEdit = false,
  showIngredientsForm = false,
  availableOils = [],
}) => {
  const { t } = useLang();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedOils, setSelectedOils] = useState({});

  useEffect(() => {
    const initData = {};
    fields.forEach(field => {
      initData[field.key] = initialData[field.key] || field.defaultValue || '';
    });
    setFormData(initData);

    if (initialData.ingredients && initialData.ingredients.length > 0) {
      const initialOils = {};
      initialData.ingredients.forEach(ingredient => {
        if (ingredient.oilReference !== -1) {
          initialOils[ingredient.oilReference?.toString()] = ingredient.percent?.toString();
        }
      });
      setSelectedOils(initialOils);
    }
  }, [fields, initialData]);

  const validateField = (field, value) => {
    if (field.required && !value?.toString().trim()) {
      return t("FieldRequired", { field: field.label });
    }
    if (field.type === 'number' && value && isNaN(value)) {
      return t("FieldMustBeNumber", { field: field.label });
    }
    if (field.minLength && value?.toString().length < field.minLength) {
      return t("FieldMinLength", { field: field.label, min: field.minLength });
    }
    if (field.maxLength && value?.toString().length > field.maxLength) {
      return t("FieldMaxLength", { field: field.label, max: field.maxLength });
    }
    return null;
  };

  const getTotalPercentage = () =>
    Object.values(selectedOils).reduce((sum, percent) =>
      sum + (parseFloat(percent) || 0), 0);

  const getOtherPercentage = () => {
    const total = getTotalPercentage();
    return total >= 100 ? 0 : 100 - total;
  };

  const validateIngredients = () => {
    if (!showIngredientsForm) return { hasErrors: false, errors: {} };

    const ingredients = Object.entries(selectedOils)
      .filter(([oilId, percent]) => percent && parseFloat(percent) > 0);

    if (ingredients.length === 0) {
      Alert.alert(t("MissingIngredients"), t("PleaseAddIngredient"));
      return { hasErrors: true, errors: {} };
    }

    const total = getTotalPercentage() + getOtherPercentage();
    if (total !== 100) {
      Alert.alert(t("FormulaError"), t("TotalMustBe100", { total: total.toFixed(1) }));
      return { hasErrors: true, errors: {} };
    }

    return { hasErrors: false, errors: {} };
  };

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  const updateOilPercentage = (oilId, percentage) => {
    setSelectedOils(prev => ({ ...prev, [oilId?.toString()]: percentage }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    let hasErrors = false;

    fields.forEach(field => {
      const error = validateField(field, formData[field.key]);
      if (error) {
        newErrors[field.key] = error;
        hasErrors = true;
      }
    });

    if (showIngredientsForm) {
      const ingredientValidation = validateIngredients();
      if (ingredientValidation.hasErrors) {
        hasErrors = true;
      }
    }

    setErrors(newErrors);

    if (!hasErrors) {
      const processedData = { ...formData };
      fields.forEach(field => {
        if (field.type === 'number' && processedData[field.key]) {
          processedData[field.key] = parseFloat(processedData[field.key]);
        }
      });

      if (showIngredientsForm) {
        let ingredients = Object.entries(selectedOils)
          .filter(([oilId, percent]) => percent && parseFloat(percent) > 0)
          .map(([oilId, percent]) => ({
            oilReference: parseInt(oilId),
            percent: parseFloat(percent)
          }));

        // Always push "Other" as remainder
        ingredients.push({
          oilReference: -1,
          percent: getOtherPercentage(),
          oilName: "Other"
        });

        processedData.ingredients = ingredients;
      }

      onSubmit(processedData);
    } else {
      Alert.alert(t("ValidationError"), t("FixErrors"));
    }
  };

  const renderIngredientsForm = () => {
    if (!showIngredientsForm) return null;

    const totalPercentage = getTotalPercentage();
    const otherPercentage = getOtherPercentage();

    return (
      <View style={styles.ingredientsSection}>
        {!!availableOils?.length > 0 && (
          <View style={styles.ingredientsHeader}>
            <Text style={styles.sectionTitle}>{t("ProductFormula")}</Text>
            <Text style={[
              styles.percentageInfo,
              totalPercentage + otherPercentage !== 100 && styles.percentageError
            ]}>
              {`${t("TotalPercentage")} %${(totalPercentage + otherPercentage).toFixed(2)}`}
            </Text>
          </View>
        )}

        <Text style={styles.instructionText}>
          {!!availableOils?.length > 0 ? t("EnterPercentage") : t("AddOilsFirst")}
        </Text>

        {availableOils?.map((oil, index) => (
          <View key={index} style={styles.oilRow}>
            <View style={styles.oilInfo}>
              <Text style={styles.oilName}>{oil?.title}</Text>
              <Text style={styles.oilPrice}>{t("PricePerKg", { price: oil?.price })}</Text>
            </View>
            <View style={styles.percentageInput}>
              <CustomTextInput
                value={selectedOils[oil.id] || ''}
                onChangeText={(text) => updateOilPercentage(oil.id, text)}
                placeholder="0"
                keyboardType="numeric"
                maxLength={5}
                inputStyle={styles.percentInput}
                style={styles.percentInputContainer}
              />
              <Text style={styles.percentSymbol}>%</Text>
            </View>
          </View>
        ))}

        {/* Always show "Other" (auto-calculated, not editable) */}
        <View style={styles.oilRow}>
          <View style={styles.oilInfo}>
            <Text style={styles.oilName}>{t("Other")}</Text>
            <Text style={styles.oilPrice}>{t("AutoCalculated")}</Text>
          </View>
          <View style={styles.percentageInput}>
            <CustomTextInput
              value={otherPercentage.toFixed(2)}
              editable={false}
              placeholder="0"
              keyboardType="numeric"
              inputStyle={[styles.percentInput, { color: "#6b7280" }]}
              style={styles.percentInputContainer}
            />
            <Text style={styles.percentSymbol}>%</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t(title)}</Text>
        <Text style={styles.headerSubtitle}>
          {isEdit ? t("UpdateDetails") : t("FillDetails")}
        </Text>
      </View>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formContent}
      >
        {fields.map(field => (
          <CustomTextInput
            key={field.key}
            label={t(field.label)}
            value={formData[field.key] || ''}
            onChangeText={(text) => { handleInputChange(field.key, text) }}
            placeholder={field.placeholder ? t(field.placeholder) : `${t("Enter")} ${t(field.label)}`}
            error={errors[field.key]}
            helper={field.helper ? t(field.helper) : null}
            required={field.required}
            multiline={field.multiline}
            keyboardType={field.type === 'number' ? 'numeric' : 'default'}
            maxLength={field.maxLength}
            numberOfLines={field.multiline ? 3 : 1}
          />
        ))}
        {renderIngredientsForm()}
      </ScrollView>

      <View style={styles.actionContainer}>
        <CustomButton
          title={t("Cancel")}
          onPress={onCancel}
          variant="outline"
          style={styles.actionButton}
        />
        <CustomButton
          title={t(submitText)}
          onPress={handleSubmit}
          variant="primary"
          style={styles.actionButton}
        />
      </View>
    </View>
  );
};

export default DynamicForm;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  headerContainer: { backgroundColor: "white", paddingHorizontal: widthToDp(6), paddingVertical: heightToDp(3), borderBottomWidth: 1, borderBottomColor: "#e2e8f0", elevation: 2 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#1e293b", marginBottom: 4 },
  headerSubtitle: { fontSize: 16, color: "#64748b", fontWeight: "400" },
  formContainer: { flex: 1 },
  formContent: { padding: widthToDp(6) },
  ingredientsSection: { marginTop: heightToDp(2) },
  ingredientsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: heightToDp(2) },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#1e293b" },
  percentageInfo: { fontSize: 14, fontWeight: "600", color: "#3b82f6", backgroundColor: "#eff6ff", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  percentageError: { color: "#dc2626", backgroundColor: "#fef2f2" },
  instructionText: { fontSize: 16, color: "#6b7280", marginBottom: 20, textAlign: 'center', fontStyle: 'italic' },
  oilRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: "white", padding: 16, borderRadius: 12, marginBottom: 8, elevation: 1 },
  oilInfo: { flex: 1 },
  oilName: { fontSize: 16, fontWeight: "600", color: "#1e293b" },
  oilPrice: { fontSize: 14, color: "#16a34a", marginTop: 2, fontWeight: "500" },
  percentageInput: { flexDirection: 'row', alignItems: 'center' },
  percentInputContainer: { marginBottom: 0, width: widthToDp(20) },
  percentInput: { textAlign: 'center', height: heightToDp(12), marginBottom: 0 },
  percentSymbol: { fontSize: 16, fontWeight: "600", color: "#6b7280", marginLeft: 8 },
  actionContainer: { flexDirection: "row", paddingHorizontal: widthToDp(6), paddingVertical: heightToDp(3), gap: 12, backgroundColor: "white", borderTopWidth: 1, borderTopColor: "#e2e8f0", elevation: 8 },
  actionButton: { flex: 1 }
});
