<script lang="ts">
	import { server_loads } from './../../../.svelte-kit/generated/client/app.js';
	import AlertDialogCancel from './../../lib/components/ui/alert-dialog/alert-dialog-cancel.svelte';
	import AlertDialogFooter from './../../lib/components/ui/alert-dialog/alert-dialog-footer.svelte';
	import { AlertDialog, AlertDialogTrigger } from '$lib/components/ui/alert-dialog';
	import AlertDialogContent from '$lib/components/ui/alert-dialog/alert-dialog-content.svelte';
	import AlertDialogHeader from '$lib/components/ui/alert-dialog/alert-dialog-header.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Tabs } from '$lib/components/ui/tabs';
	import TabsContent from '$lib/components/ui/tabs/tabs-content.svelte';
	import TabsList from '$lib/components/ui/tabs/tabs-list.svelte';
	import TabsTrigger from '$lib/components/ui/tabs/tabs-trigger.svelte';
	import { Plus } from 'lucide-svelte';

	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<AlertDialog>
	<AlertDialogTrigger>
		<Button class="gap-1" variant="secondary">
			<Plus></Plus>
			New Bot
		</Button>
	</AlertDialogTrigger>

	<AlertDialogContent class="bg-card">
		<AlertDialogHeader>New bot</AlertDialogHeader>
		<div class="flex gap-4 flex-col justify-stretch items-stretch">
			<Tabs class="flex gap-2">
				<div>
					<Label>Login method</Label>
					<TabsList class="grid w-full grid-cols-2">
						<TabsTrigger value="offline">Offline</TabsTrigger>
						<TabsTrigger value="microsoft">Microsoft</TabsTrigger>
					</TabsList>
				</div>
				<TabsContent value="offline" class="mt-0 flex-1">
					<Label>Bot name</Label>
					<Input placeholder="Bot"></Input>
				</TabsContent>
				<TabsContent value="microsoft" class="mt-0 flex-1">
					<Label>Email</Label>
					<Input type="mail" placeholder="example@mail.com"></Input>
				</TabsContent>
			</Tabs>
			<Tabs class="flex gap-2">
				<div>
					<Label>Server type</Label>
					<TabsList class="grid w-full grid-cols-2">
						<TabsTrigger value="server">Server</TabsTrigger>
						<TabsTrigger value="localhost">Localhost</TabsTrigger>
					</TabsList>
				</div>
				<TabsContent value="localhost" class="mt-0 flex-1">
					<Label>Port</Label>
					<Input placeholder="25565"></Input>
				</TabsContent>
				<TabsContent value="server" class="mt-0 flex-1">
					<Label>Server IP</Label>
					<Input placeholder="hypixel.net"></Input>
				</TabsContent>
			</Tabs>
		</div>
		<AlertDialogFooter>
			<AlertDialogCancel>Cancel</AlertDialogCancel>
			<Button>Create</Button>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
