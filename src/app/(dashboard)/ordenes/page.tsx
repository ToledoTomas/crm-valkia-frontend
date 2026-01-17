"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Tables, { Order } from "./_components/Tables";
import Search from "../../(components)/Search";
import { getOrders, deleteOrder } from "./api";

const PageOrdenes = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getOrders();
      // Sort by most recent date
      const sortedOrders = res.sort(
        (a: Order, b: Order) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setOrders(sortedOrders);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error fetching orders");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = React.useCallback(async (term: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await getOrders();
      let results = res;

      if (term.trim() !== "") {
        const lowerTerm = term.toLowerCase();
        results = res.filter(
          (order: Order) =>
            order.id.toString().includes(lowerTerm) ||
            (order.customer?.fullname || "").toLowerCase().includes(lowerTerm)
        );
      }

      const sortedOrders = results.sort(
        (a: Order, b: Order) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setOrders(sortedOrders);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error searching orders");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteOrder(id);
      setOrders(orders.filter((order) => order.id !== id));
    } catch (err: unknown) {
      console.error("Error deleting order:", err);
      // alert("Error al eliminar la orden");
    }
  };

  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchOrders();
      hasFetched.current = true;
    }
  }, [fetchOrders]);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="w-full md:w-auto">
          <h2 className="text-2xl mb-4">Ordenes</h2>
          <Search onSearch={handleSearch} />
        </div>
        <Link
          href="/ordenes/agregar-ordenes"
          className="mt-2 text-nowrap p-3 rounded-md flex flex-row items-center gap-2 bg-[#e5e5d0] text-black cursor-pointer hover:bg-[#d8d8b9]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-plus"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 5l0 14" />
            <path d="M5 12l14 0" />
          </svg>
          Nueva Orden
        </Link>
      </div>
      <div className="w-full border border-gray-200 rounded-lg">
        <Tables
          orders={orders}
          isLoading={isLoading}
          error={error}
          onDelete={handleDelete}
          refresh={fetchOrders}
        />
      </div>
    </div>
  );
};

export default PageOrdenes;
