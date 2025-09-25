<script lang="ts">
	import "../app.css";
</script>
<header class="header">
<h1>Welcome to Employee Management</h1><br>
<p>Manage your employees efficiently — add, edit, or remove records</p>
</header>
<main class="container">
	<slot />
</main>
<style>
.header {
text-align: center;
	background: linear-gradient(90deg, #7570d8, #3b82f6); 
padding: 2rem;
border-radius: 8px;
	margin-bottom: 2rem;}
.header p,h1 {
	color: #e0e7ff; 
font-family: sans-serif;
font-weight: bold;
}
.container {
	max-width: 900px;
margin: auto;
}
</style>
