<script lang="ts">
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

	<AlertDialogContent>
		<AlertDialogHeader>New bot</AlertDialogHeader>
		<Tabs>
			<TabsList class="grid w-full grid-cols-2">
				<TabsTrigger value="offline">Offline</TabsTrigger>
				<TabsTrigger value="microsoft">Microsoft</TabsTrigger>
			</TabsList>
			<TabsContent value="offline">
				<Label>Bot name</Label>
				<Input placeholder="Bot"></Input>
			</TabsContent>
		</Tabs>
	</AlertDialogContent>
</AlertDialog>
