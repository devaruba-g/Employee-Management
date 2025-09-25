<script lang="ts">
import { enhance } from "$app/forms";
    import { invalidate } from "$app/navigation";
import { toast, Toaster } from "svelte-sonner";
import * as Table from "$lib/components/ui/table";
import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
import * as Select from "$lib/components/ui/select/index.js";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
       import { Tabs, TabsList, TabsTrigger, TabsContent } from "$lib/components/ui/tabs";
  import { Badge } from "$lib/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "$lib/components/ui/avatar";
  import { writable, derived } from "svelte/store";
 export let data: {
  employees: { id: number; name: string; role: string; email: string }[];
};
  let edit: { id: number; name: string; role: string; email: string } | null = null;
  let name = "";
  let email = "";
  let tab = "add";
  let log = false;
  let roleslist = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
    { value: "manager", label: "Manager" },
    { value: "guest", label: "Guest" },
  ];
  let role = writable("");
let con = derived(
 role ,
  ($value) => roleslist.find(f => f.value === $value)?.label ?? "Select a fruit"
);
</script>
<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
<Card class="bg-white border border-gray-200 p-4 text-center">
<CardHeader>
  <CardTitle>Total Employees</CardTitle>
</CardHeader>
<CardContent>
  <p class="text-2xl font-bold">{data.employees.length}</p>
</CardContent>
</Card>
<Card class="bg-white border border-gray-200 p-4 text-center">
<CardHeader>
<CardTitle>Admins</CardTitle>
</CardHeader>
<CardContent>
<p class="text-2xl font-bold">{data.employees.filter(e => e.role === "admin").length}</p>
</CardContent>
</Card>
<Card class="bg-white border border-gray-200 p-4 text-center">
<CardHeader>
  <CardTitle>Users</CardTitle>
</CardHeader>
<CardContent>
  <p class="text-2xl font-bold">{data.employees.filter(e => e.role === "user").length}</p>
</CardContent>
</Card>
<Card class="bg-white border border-gray-200 p-4 text-center">
<CardHeader>
  <CardTitle>Managers</CardTitle>
</CardHeader>
<CardContent>
  <p class="text-2xl font-bold">{data.employees.filter(e => e.role === "manager").length}</p>
</CardContent>
</Card>
</div>
<Toaster position="top-right" />
<Card class="container">
<CardHeader>
<CardTitle class="text-center">Employee Records</CardTitle>
</CardHeader>
<CardContent>
<Tabs bind:value={tab}>
  <TabsList>
        <TabsTrigger value="add">New Employee</TabsTrigger>
<TabsTrigger value="list">Employee List</TabsTrigger>
<TabsTrigger value="cards">Employee Card</TabsTrigger></TabsList>
<TabsContent value="add">
<div class="add-employee-layout">
<div class="left">
<form
  method="POST"
  use:enhance
  on:submit={async (event) => {
toast.success("Employee Added Successfully!");
name = "";
email = "";
role.set("");
await invalidate("");
  }}
class="form">
<div class="form-group">
  <br><br>
<Input id="name" name="name" placeholder="Enter name" bind:value={name} required />
</div>
<div class="form-group">
<Select.Root type="single" name="role" bind:value={$role}>
<Select.Trigger class="select-trigger">{$con}</Select.Trigger>
<Select.Content>
  <Select.Group>
    <Select.Label>Roles</Select.Label>
    {#each roleslist as r (r.value)}
      <Select.Item value={r.value} label={r.label}>{r.label}</Select.Item>
    {/each}
    </Select.Group></Select.Content></Select.Root>
</div>
<div class="form-group">
<Input id="email" name="email" placeholder="Enter email" bind:value={email} required /></div>
<div class="actions">
<Button type="submit">Add Employee</Button></div></form></div>
<div class="right">
<div>
  <img src="/team.jpg" alt="Employee Illustration" />
  </div></div></div>
</TabsContent>
<TabsContent value="list">
<Table.Root class="table">
<Table.Header>
<Table.Row>
  <Table.Head>Avatar</Table.Head>
  <Table.Head>Name</Table.Head>
  <Table.Head>Role</Table.Head>
  <Table.Head>Email</Table.Head>
  <Table.Head>Edit</Table.Head>
  <Table.Head>Delete</Table.Head></Table.Row></Table.Header>
<Table.Body>
{#each data.employees as emp}
<Table.Row>
<Table.Cell>
<Avatar>
  <AvatarImage src={`https://i.pravatar.cc/40?u=${emp.id}`} alt={emp.name} />
  <AvatarFallback>{emp.name[0]}</AvatarFallback>
</Avatar>
</Table.Cell>
<Table.Cell>{emp.name}</Table.Cell>
<Table.Cell>
<Badge variant="secondary">{emp.role}</Badge></Table.Cell>
<Table.Cell>{emp.email}</Table.Cell>
<Table.Cell>
<Dialog.Root bind:open={log}>
<Dialog.Trigger>
  <Button
    size="sm"
    onclick={() => {
      edit = { ...emp };
      name = emp.name;
      email = emp.email;
      role.set(emp.role);
      log = true;
    }}> Edit
</Button> </Dialog.Trigger>
<Dialog.Content >
<div class="dialog">
<Dialog.Header>
  <Dialog.Title>Edit Employee</Dialog.Title>
</Dialog.Header>
<form
  method="POST"
use:enhance={({ formElement }) => {
formElement.addEventListener("save", async (event) => {
let formData = new FormData(formElement);
let response = await fetch(formElement.action, { method: "POST", body: formData });
if (response.ok) {
edit = null;
name = "";
email = "";
role.set("");
tab = "list";
log = false;
await invalidate("");
}
});
}}
class="form">
<input type="hidden" name="id" value={edit?.id} />
<input type="hidden" name="action" value="edit" />
<div class="form-group">
<Input id="name" name="name" bind:value={name} /></div>
<div class="form-group">
<Select.Root type="single" name="role" bind:value={$role}>
<Select.Trigger class="select-trigger">{$con}</Select.Trigger><Select.Content><Select.Group>
  <Select.Label>Roles</Select.Label>
  {#each roleslist as r (r.value)}
    <Select.Item value={r.value} label={r.label}>{r.label}</Select.Item>
  {/each}</Select.Group></Select.Content></Select.Root>
</div>
<div class="form-group">
<Input id="email" name="email" bind:value={email} />
</div>
<div class="actions">
<Button type="submit">Save</Button></div></form></div>
</Dialog.Content></Dialog.Root></Table.Cell><Table.Cell><AlertDialog.Root>
<AlertDialog.Trigger>
<Button variant="destructive" size="sm">Delete</Button>
</AlertDialog.Trigger>
<AlertDialog.Content>
<AlertDialog.Header>
<AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
<AlertDialog.Description>
Are you sure you want to delete {emp.name}?</AlertDialog.Description>
</AlertDialog.Header><div class="actions gap-2">
<form method="POST"
use:enhance={({ formElement }) => {
formElement.addEventListener("confirm", async (event) => {
event.preventDefault();
let formData = new FormData(formElement);
let response = await fetch(formElement.action, { method: "POST", body: formData });
if (response.ok) await invalidate("");
});
}}>
<input type="hidden" name="id" value={emp.id} />
<Button type="submit" name="action" value="delete" variant="destructive">Confirm</Button>
</form>
<AlertDialog.Cancel>
<Button variant="ghost">Cancel</Button>
</AlertDialog.Cancel></div></AlertDialog.Content>
</AlertDialog.Root></Table.Cell></Table.Row>
{/each}</Table.Body></Table.Root></TabsContent>
<TabsContent value="cards">
<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
{#each data.employees as emp}
  <Card>
<CardContent class="flex items-center gap-4 p-4">
  <Avatar class="w-14 h-14">
<AvatarImage src={`https://i.pravatar.cc/60?u=${emp.id}`} alt={emp.name} />
<AvatarFallback>{emp.name[0]}</AvatarFallback></Avatar>
<div><h3 class="font-semibold text-lg">{emp.name}</h3>
  <p class="text-sm text-gray-600">{emp.role}</p>
  <p class="text-sm text-gray-500">{emp.email}</p></div></CardContent>
</Card>
 {/each}
</div></TabsContent></Tabs></CardContent></Card>
<style>
.add-employee-layout {
  display: flex;
  gap: 2rem;
}
.add-employee-layout .left {
flex: 1;
}
.add-employee-layout .right {
  flex: 1;
}
.form {
  display: flex;
flex-direction: column;
gap: 1rem;
  margin-top: 1rem;
}
:global(.table) {
  width: 100%;
margin-top: 1rem;
}
.actions {
  display: flex;
justify-content: flex-end;
gap: 0.5rem;
margin-top: 1rem;}
:global(.select-trigger) {
  width: 100%;                  
  height: 40px;}
</style>
