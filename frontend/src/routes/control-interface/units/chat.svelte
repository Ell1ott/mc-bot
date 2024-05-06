<script lang="ts">
	import { TriangleAlert, Info, RefreshCcw } from 'lucide-svelte';
	import { socket } from '../../store';
	import sendicon from '$lib/send-icon.svg';
	let chats = [];

	console.log('mounted chat');
	$socket?.on('chatHistory', (chatHistory) => {
		chats = [...chats, ...chatHistory];
	});
	$socket?.on('alert', (message) => {
		console.log(message);
		chats = [...chats, { type: 'alert', msg: message }];
	});
	$socket?.on('message', (message) => {
		console.log(message);
		chats = [...chats, { type: 'message', msg: message }];
	});
	$socket?.on('info', (message) => {
		console.log(message);
		chats = [...chats, { type: 'info', msg: message }];
	});

	function copy(string) {
		navigator.clipboard.writeText(string);
		console.log('copied ' + string + ' to clipboard');
	}

	let userMessage;

	function sendMessage() {
		if (userMessage == '') return;
		$socket?.emit('sendchat', userMessage);
		console.log('send ' + userMessage + ' in chat');
		userMessage = '';
	}
</script>

<div class="chat-unit">
	<!-- <div class="flex column m5 flex1"> -->
	<div class="chat m5">
		{#each chats as chat}
			<!-- content here -->
			<div class={'flex items-center ' + chat.type}>
				{#if chat.type == 'alert'}
					<TriangleAlert size="16" />
				{:else if chat.type == 'info'}
					<Info size="16" />
				{/if}
				<p>{@html chat.msg}</p>
				{#if chat.msg.includes('isconnected from server')}
					<button
						class="flex items-center gap-2 ml-auto px-2 py-1 m-0.5 text-sm bg-sky-900 rounded-md"
						on:click={() => $socket.emit('rejoin')}
					>
						<RefreshCcw size="16" />
						Rejoin</button
					>
				{/if}
			</div>
		{/each}
	</div>
	<div class="chat-input m5">
		<input
			type="text"
			class="px-4 py-2.5"
			placeholder="Type a message..."
			on:keypress={(e) => {
				if (e.charCode === 13) sendMessage();
			}}
			bind:value={userMessage}
			required
		/>
		<button id="send-button" on:click={sendMessage}>
			<img class="icon" src={sendicon} alt="hej" />
		</button>
	</div>
	<!-- </div> -->
</div>

<style>
	.m5 {
		margin: 5px;
	}
	.chat {
		padding: 5px;
		background-color: rgba(0, 0, 0, 0.242);
		border-radius: 10px 10px 0 0;
		/* min-height: 100px; */
		/* height: 100%; */
		/* bottom: 0; */
		/* max-height: 390px; */
		overflow-y: scroll;
		overscroll-behavior-y: contain;
		scroll-snap-type: y proximity;
		display: flex;
		flex-direction: column;

		/* margin: 5px; */
		margin-bottom: 0;

		flex: 1;
		/* height: 70%; */
	}

	.chat > div:last-child {
		scroll-snap-align: end;
	}

	.alert {
		padding: 5px;
		background-color: #ff4b0096;
		border-radius: 5px;
		margin: 3px;
	}
	.info {
		padding: 5px;
		background-color: var(--accent-color);
		border-radius: 5px;
		margin: 3px;
	}

	.info p::first-letter {
		text-transform: uppercase;
	}
	.alert p::first-letter {
		text-transform: uppercase;
	}

	.chat::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.chat {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	p {
		padding: 5px;
		padding-bottom: 2px;
		padding-top: 2px;

		margin: 0;
	}

	.no-mag {
		padding-left: 0;
	}
	.chat-unit {
		/* padding: 5px; */
		height: 100%;

		display: flex;
		flex-direction: column;
	}

	.message {
		display: flex;
	}

	.username {
		border-radius: 5px;
		cursor: pointer;
		color: rgb(255, 255, 255);
	}

	.username:hover {
		background-color: rgb(0, 82, 91);
	}

	.chat-input {
		background-color: rgba(0, 0, 0, 0.318);
		border-radius: 0 0 10px 10px;
		/* padding: 5px; */

		border-top: rgb(255, 255, 255) 10px;
		display: flex;
		justify-content: space-between;
		/* margin-bottom: 5px; */
		margin-top: 0;
	}

	input {
		font-size: 16px;
		flex: 1;
		/* margin-bottom: 1px; */
	}

	.chat-input button {
		/* aspect-ratio: 1; */
		cursor: pointer;
		margin: 5px;

		display: flex;
		align-items: center;
		justify-content: center;
		height: 30px;
		width: 30px;
		border: none;
		border-radius: 5px;
		background-color: transparent;
		margin-right: 7px;
		transition: background-color 0.1s;

		/* width: 20px; */
		/* height: 20px; */
	}

	.chat-input button:hover {
		background-color: black;
	}

	input:invalid + button .icon {
		filter: invert(0.7);
	}

	input:invalid + button:hover {
		background-color: transparent;
	}
	input:invalid + button {
		cursor: auto;
	}

	.icon {
		height: 20px;
		color: black;

		/* transform: translate(-2px, 1px); */
	}
</style>
