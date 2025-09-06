import { get, save } from "../helpers/reusable";
import React, { createContext, useContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    
  // States
  const [loading, setLoading] = useState(false);
  const [oilsData, setOilsData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [bottlesData, setBottlesData] = useState([]);

  // Auto-loading on mount
  useEffect(() => {
    GetOilsData();
    GetProductsData();
    GetBottlesData();
  }, []);

  // Getter Functions
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

  // Setter/Updater Functions (replace if id exists)
  const UpdateOilsData = async (id, newItem) => {
    setLoading(true);
    try {
      let existingData = (await get("oils")) || [];
      existingData = existingData.filter((item) => item.id !== id);
      const updatedData = [newItem, ...existingData];
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
      const updatedData = [newItem, ...existingData];
      await save("products", updatedData);
      setProductsData(updatedData);
    } catch (e) {
      console.error("Failed to update products:", e);
    } finally {
      setLoading(false);
    }
  };

  const UpdateBottlesData = async (id, newItem) => {
    setLoading(true);
    try {
      let existingData = (await get("bottles")) || [];
      existingData = existingData.filter((item) => item.id !== id);
      const updatedData = [newItem, ...existingData];
      await save("bottles", updatedData);
      setBottlesData(updatedData);
    } catch (e) {
      console.error("Failed to update bottles:", e);
    } finally {
      setLoading(false);
    }
  };

  // Adder Functions (always add new item)
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
      let existingData = (await get("products")) || [];
      const updatedData = [newItem, ...existingData];
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

  // Remover Functions (delete by id)
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
