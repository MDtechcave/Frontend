<script setup lang="ts">
import AdminNav from '@/components/AdminNav.vue';

</script>

<template>
    <AdminNav />

    <main>
        
        <h2>Customer Management</h2>
        <div class="customer-table">
        <table>
            <th>
                <td>
                    <tr>Customer Name</tr>
            <tr>Email</tr>
            <tr>Password</tr>
            <tr>Address</tr>
                </td>
            
            </th>
            
        </table>
        </div>
    </main>

    </template>

    <style scoped>
    .customer-table {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
  background-color: #f2f2f2;
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #04AA6D;
  color: white;
    }

</style>