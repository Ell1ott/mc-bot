<script lang="ts">
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
	import { socket } from '../store.js';
	import { server } from 'typescript';

	console.log('newbot');

	let auth = 'offline';
	let name = '';
	let email = '';

	let serverType = 'server';
	let serverIP = '';
	let serverPort = '';

	function createNewBot(e) {
		e.preventDefault();
		console.log('Creating new bot');
		const options: any = { auth };

		options.username = auth == 'offline' ? name || 'Bot' : email;

		console.log(serverType);

		console.log(+serverPort);

		options.port = +serverPort;
		console.log(options.port);

		options.host = serverType === 'server' ? serverIP : 'localhost';
		if (serverType === 'localhost') {
			options.port = +serverPort;
		}
		$socket.emit('createBot', options);

		if (auth == 'microsoft') {
			$socket.once('msa', (resp) => {
				console.log(resp);

				window.location.href = 'http://microsoft.com/link?otc=' + resp.user_code;
			});
		}
	}
</script>

<AlertDialog closeOnOutsideClick={true}>
	<AlertDialogTrigger>
		<Button class="gap-1" variant="secondary">
			<Plus></Plus>
			New Bot
		</Button>
	</AlertDialogTrigger>

	<AlertDialogContent class="bg-card">
		<AlertDialogHeader>New bot</AlertDialogHeader>
		<div class="flex gap-4 flex-col justify-stretch items-stretch">
			<Tabs class="flex gap-2" bind:value={auth}>
				<div>
					<Label>Login method</Label>
					<TabsList class="grid w-full grid-cols-2">
						<TabsTrigger value="offline">Offline</TabsTrigger>
						<TabsTrigger value="microsoft">Microsoft</TabsTrigger>
					</TabsList>
				</div>
				<TabsContent value="offline" class="mt-0 flex-1">
					<Label>Bot name</Label>
					<Input placeholder="Bot" bind:value={name}></Input>
				</TabsContent>
				<TabsContent value="microsoft" class="mt-0 flex-1">
					<Label>Email</Label>
					<Input type="mail" placeholder="example@mail.com" bind:value={email}></Input>
				</TabsContent>
			</Tabs>
			<Tabs class="flex gap-2" bind:value={serverType}>
				<div>
					<Label>Server type</Label>
					<TabsList class="grid w-full grid-cols-2">
						<TabsTrigger value="server">Server</TabsTrigger>
						<TabsTrigger value="localhost">Localhost</TabsTrigger>
					</TabsList>
				</div>
				<TabsContent value="localhost" class="mt-0 flex-1">
					<Label>Port</Label>
					<Input placeholder="25565" bind:value={serverPort}></Input>
				</TabsContent>
				<TabsContent value="server" class="mt-0 flex-1">
					<Label>Server IP</Label>
					<Input placeholder="hypixel.net" bind:value={serverIP}></Input>
				</TabsContent>
			</Tabs>
		</div>
		<AlertDialogFooter>
			<AlertDialogCancel>Cancel</AlertDialogCancel>
			<Button on:click={createNewBot}>Create</Button>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
