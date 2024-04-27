<script>
	import { onMount } from "svelte";
	import { socket } from "../store";
	import sendicon from "$lib/send-icon.svg";
	let chats = [];

	console.log("mounted chat");
	$socket?.on("chat", (chat) => {
		chats = [...chats, { type: "chat", ...chat }];
	});
	$socket?.on("alert", (message) => {
		chats = [...chats, { type: "alert", msg: message }];
	});
	$socket?.on("message", (message) => {
		console.log(message);
		chats = [...chats, { type: "message", msg: message }];
	});
	$socket?.on("info", (message) => {
		console.log(message);
		chats = [...chats, { type: "info", msg: message }];
	});

	function copy(string) {
		navigator.clipboard.writeText(string);
		console.log("copied " + string + " to clipboard");
	}

	let userMessage;

	function sendMessage() {
		if (userMessage == "") return;
		$socket?.emit("sendchat", userMessage);
		console.log("send " + userMessage + " in chat");
		userMessage = "";
	}
</script>

<div class="chat-unit">
	<!-- <div class="flex column m5 flex1"> -->
	<div class="chat m5">
		{#each chats as chat}
			{#if chat.type == "chat"}
				<div class="message">
					<p
						class="username"
						on:click={copy(chat.username)}
						on:keydown={copy(chat.username)}
					>
						{chat.username}
					</p>
					<p class="no-mag">:</p>
					<p class="no-mag" />

					<p>{@html chat.msg}</p>
				</div>
			{:else}
				<!-- content here -->
				<div class={chat.type}>
					<p>{@html chat.msg}</p>
				</div>
			{/if}
		{/each}
	</div>
	<div class="chat-input m5">
		<input
			type="text"
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
		background-color: rgb(169, 0, 0);
		border-radius: 5px;
		margin: 3px;
	}
	.info {
		padding: 5px;
		background-color: var(--accent-color);
		border-radius: 5px;
		margin: 3px;
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
		font-size: 14px;
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
		border: none;
		background-color: transparent;
		font-size: 16px;
		flex: 1;
		padding: 10px;
		color: var(--font);
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
