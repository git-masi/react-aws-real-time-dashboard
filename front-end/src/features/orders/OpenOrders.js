import React from 'react';
import { useGetOrdersQuery } from '../../app/api';

export default function OpenOrders() {
  const { data, error, isLoading } = useGetOrdersQuery();

  console.log(data);

  return isLoading ? (
    <h1>loading</h1>
  ) : error ? (
    <h1>you done messed up a-a-ron!</h1>
  ) : data ? (
    <h1>got the data!</h1>
  ) : null;
}
