import { get, save } from "../helpers/reusable";
import React, { createContext, useContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // States
  const [loading, setLoading] = useState(false);
  const [oilsData, setOilsData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [bottlesData, setBottlesData] = useState([]);
  const [currentUnit, setCurrentUnit] = useState("g");

  // Auto-loading on mount
  useEffect(() => {
    GetOilsData();
    GetProductsData();
    GetBottlesData();
  }, []);

  // Toggle Unit
  const ToggleUnit = () => {
    setCurrentUnit((prev) => (prev === "g" ? "kg" : "g"));
  };

  // --- Getter Functions ---
  const GetOilsData = async () => {
    setLoading(true);
    try {
      const data = await get("oils");
      if (data) setOilsData(data);
    } catch (e) {
      console.error("Failed to load oils:", e);
    } finally {
      setLoading(false);
    }
  };

  const GetProductsData = async () => {
    setLoading(true);
    try {
      const data = await get("products");
      if (data) setProductsData(data);
    } catch (e) {
      console.error("Failed to load products:", e);
    } finally {
      setLoading(false);
    }
  };

  const GetBottlesData = async () => {
    setLoading(true);
    try {
      const data = await get("bottles");
      if (data) setBottlesData(data);
    } catch (e) {
      console.error("Failed to load bottles:", e);
    } finally {
      setLoading(false);
    }
  };

  // --- Updater Functions ---
  const UpdateOilsData = async (id, newItem) => {
    setLoading(true);
    try {
      let existingData = (await get("oils")) || [];
      existingData = existingData.filter((item) => item.id !== id);
      const updatedData = [{ ...newItem, id }, ...existingData];
      await save("oils", updatedData);
      setOilsData(updatedData);
    } catch (e) {
      console.error("Failed to update oils:", e);
    } finally {
      setLoading(false);
    }
  };

  const UpdateProductsData = async (id, newItem) => {
    setLoading(true);
    try {
      let existingData = (await get("products")) || [];
      existingData = existingData.filter((item) => item.id !== id);
      const updatedData = [{ ...newItem, id }, ...existingData];
      await save("products", updatedData);
      setProductsData(updatedData);
    } catch (e) {
      console.error("Failed to update product:", e);
    } finally {
      setLoading(false);
    }
  };

  const UpdateBottlesData = async (id, newItem) => {
    setLoading(true);
    try {
      let existingData = (await get("bottles")) || [];
      existingData = existingData.filter((item) => item.id !== id);
      const updatedData = [{ ...newItem, id }, ...existingData];
      await save("bottles", updatedData);
      setBottlesData(updatedData);
    } catch (e) {
      console.error("Failed to update bottles:", e);
    } finally {
      setLoading(false);
    }
  };

  // --- Adders ---
  const AddOil = async (newItem) => {
    setLoading(true);
    try {
      let existingData = (await get("oils")) || [];
      const updatedData = [newItem, ...existingData];
      await save("oils", updatedData);
      setOilsData(updatedData);
    } catch (e) {
      console.error("Failed to add oil:", e);
    } finally {
      setLoading(false);
    }
  };

  const AddProduct = async (newItem) => {
    setLoading(true);
    try {
      const existingData = (await get("products")) || [];
      const updatedData = [...existingData, { ...newItem, id: Date.now() }];
      await save("products", updatedData);
      setProductsData(updatedData);
    } catch (e) {
      console.error("Failed to add product:", e);
    } finally {
      setLoading(false);
    }
  };

  const AddBottle = async (newItem) => {
    setLoading(true);
    try {
      let existingData = (await get("bottles")) || [];
      const updatedData = [newItem, ...existingData];
      await save("bottles", updatedData);
      setBottlesData(updatedData);
    } catch (e) {
      console.error("Failed to add bottle:", e);
    } finally {
      setLoading(false);
    }
  };

  // --- Removers ---
  const RemoveOil = async (id) => {
    setLoading(true);
    try {
      let existingData = (await get("oils")) || [];
      const updatedData = existingData.filter((item) => item.id !== id);
      await save("oils", updatedData);
      setOilsData(updatedData);
    } catch (e) {
      console.error("Failed to remove oil:", e);
    } finally {
      setLoading(false);
    }
  };

  const RemoveProduct = async (id) => {
    setLoading(true);
    try {
      let existingData = (await get("products")) || [];
      const updatedData = existingData.filter((item) => item.id !== id);
      await save("products", updatedData);
      setProductsData(updatedData);
    } catch (e) {
      console.error("Failed to remove product:", e);
    } finally {
      setLoading(false);
    }
  };

  const RemoveBottle = async (id) => {
    setLoading(true);
    try {
      let existingData = (await get("bottles")) || [];
      const updatedData = existingData.filter((item) => item.id !== id);
      await save("bottles", updatedData);
      setBottlesData(updatedData);
    } catch (e) {
      console.error("Failed to remove bottle:", e);
    } finally {
      setLoading(false);
    }
  };

  // --- Delete All Data ---
  const ClearAllOils = async () => {
    setLoading(true);
    try {
      await save("oils", []);
      setOilsData([]);
    } catch (e) {
      console.error("Failed to clear oils:", e);
    } finally {
      setLoading(false);
    }
  };

  const ClearAllProducts = async () => {
    setLoading(true);
    try {
      await save("products", []);
      setProductsData([]);
    } catch (e) {
      console.error("Failed to clear products:", e);
    } finally {
      setLoading(false);
    }
  };

  const ClearAllBottles = async () => {
    setLoading(true);
    try {
      await save("bottles", []);
      setBottlesData([]);
    } catch (e) {
      console.error("Failed to clear bottles:", e);
    } finally {
      setLoading(false);
    }
  };

  const ClearAllData = async () => {
    setLoading(true);
    try {
      await save("oils", []);
      await save("products", []);
      await save("bottles", []);
      setOilsData([]);
      setProductsData([]);
      setBottlesData([]);
    } catch (e) {
      console.error("Failed to clear everything:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        // states
        loading,
        setLoading,
        oilsData,
        productsData,
        bottlesData,

        // getters
        GetOilsData,
        GetProductsData,
        GetBottlesData,

        // setters
        UpdateOilsData,
        UpdateProductsData,
        UpdateBottlesData,

        // adders
        AddOil,
        AddProduct,
        AddBottle,

        // removers
        RemoveOil,
        RemoveProduct,
        RemoveBottle,

        // clear all
        ClearAllOils,
        ClearAllProducts,
        ClearAllBottles,
        ClearAllData,

        // extra
        currentUnit,
        ToggleUnit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
