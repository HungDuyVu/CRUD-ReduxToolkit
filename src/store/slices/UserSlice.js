import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// fetch users
export const fetchUsers = createAsyncThunk("fetchUsers", async () => {
   const request = await axios.get("https://jsonplaceholder.typicode.com/users");
   const response = await request.data;
   return response;
 });

// delete user
export const deleteUser = createAsyncThunk("deleteUser", async (obj) => {
   try {
      const axiosConfig = {
         headers: {
            "Content-Type": "application/json",
         },
      };
      const request = await axios.delete(`https://jsonplaceholder.typicode.com/users/${obj.id}`, axiosConfig);
      const response = await request.data;
      console.log("Delete response: ", response);
      return {
         successMsg: "User Successfully Deleted",
         error: null,
         id: obj.id,
      };
   } catch (error) {
      console.log("Delete Error: ", error);
      return {
         successMsg: null,
         error: "Can not delete the given user",
         id: obj.id,
      }
   }
});

// add user
export const addUser = createAsyncThunk("addUser", async (obj) => {
   try {
      const axiosConfig = {
         headers: {
            "Content-Type": "application/json",
         },
      }
      const request = await axios.post(
         `https://jsonplaceholder.typicode.com/users`,
         obj, 
         axiosConfig
      );
      const response = await request.data;
      response.id = obj.id;
      console.log("Add response: " + response);
      return {
         data: response,
         successMsg: "User Successfully Added",
         error: null,
      };
   } catch (error) {
      console.log("Error adding user: " + error);
      return {
         data: null,
         successMsg: null,
         error: "Can not add the given user",
      }
   }
});

// update user
export const updateUser = createAsyncThunk("updateUser", async (obj) => {
   try {
      const axiosConfig = {
         headers: {
            "Content-Type": "application/json",
         },
      };
      const request = await axios.patch(
         `https://jsonplaceholder.typicode.com/users/${obj.id}`,
         obj, 
         axiosConfig
      );
      const response = await request.data;
      response.id = obj.id;
      console.log("Updated user response: " + response);
      return {
         data: response,
         successMsg: "User Successfully Updated",
         id: obj.id,
      }
   } catch (error) {
      console.log("Error update error: " + error);
      return {
         data: null,
         successMsg: null,
         error: "Can not update the given user",
         id: obj.id,
      }
   }
})

const userSlice = createSlice({
   name: "Users",
   initialState: {
      // fetch
      loading: true,
      data: null,
      error: null,
      // delete
      deleteUserLoading: false,
      deleteUserData: null,
      // add
      addUserLoading: false,
      addUserData: null,
      // update
      updateUserLoading: false,
      updateUserData: null,
   },
   extraReducers: (builder) => {
      builder
      // fetch users
      .addCase(fetchUsers.pending, (state) => {
         state.loading = true;
         state.data = null;
         state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
         state.loading = false;
         state.data = action.payload;
         state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
         state.loading = false;
         state.data = null;
         state.error = action.error.message;
      })
      // delete user
      .addCase(deleteUser.pending, (state) => {
         state.deleteUserLoading = true;
         state.deleteUserData = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
         state.deleteUserLoading = false;
         state.deleteUserData = action.payload;
         const { error, id } = action.payload;
         if (!error) {
            state.data = state.data.filter((data) => data.id !== id);
         }
      })
      .addCase(addUser.pending, (state) => {
         state.addUserLoading = true;
         state.addUserData = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
         state.addUserLoading = false;
         state.addUserData = action.payload;
         const { data } = action.payload;
         if (data) {
            state.data.unshift(data); // Thêm người dùng mới vào đầu danh sách thay vi push() cuoi danh sach
         }
      })
      // update user
      .addCase(updateUser.pending, (state) => {
         state.updateUserLoading = true;
         state.updateUserData = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
         state.updateUserLoading = false;
         state.updateUserData = action.payload;
         const { data, id } = action.payload;
         if (data) {
            const userIndex = state.data.filter((user) => user.id === id);
            if (userIndex !== -1) {
               state.data[userIndex] = data;
            }
         }
      });
   }
});

export default userSlice.reducer;