<script>
	import { AlertDialog } from '$lib/components/ui/alert-dialog';
	import AlertDialogContent from '$lib/components/ui/alert-dialog/alert-dialog-content.svelte';
	import AlertDialogHeader from '$lib/components/ui/alert-dialog/alert-dialog-header.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Tabs } from '$lib/components/ui/tabs';
	import TabsContent from '$lib/components/ui/tabs/tabs-content.svelte';
	import TabsList from '$lib/components/ui/tabs/tabs-list.svelte';
	import TabsTrigger from '$lib/components/ui/tabs/tabs-trigger.svelte';
</script>

<AlertDialog>
	<AlertDialogContent>
		<AlertDialogHeader>Add new bot</AlertDialogHeader>
	</AlertDialogContent>
	<Tabs>
		<TabsList>
			<TabsTrigger value="offline">Offline</TabsTrigger>
			<TabsTrigger value="microsoft">Microsoft</TabsTrigger>
		</TabsList>
		<TabsContent value="offline">
			<Input placeholder="Bot name"></Input>
		</TabsContent>
	</Tabs>
</AlertDialog>
