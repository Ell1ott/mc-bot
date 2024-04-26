<script>
  export let value;
  $: console.log(value);
  export let name;
  export let options;
  export let displayName;
  export let dropdown;
  // export let dropdown;
</script>

<div class="flex" id="container">
  {#if displayName}
    <p>{displayName}</p>
  {/if}

  {#if dropdown}
    <select bind:value {name}>
      {#each options as option}
        <option value={option}>
          {option.replaceAll("_", " ")}
        </option>
      {/each}
    </select>
  {:else}
    <div role="radiogroup" id="radiogroup">
      {#each options as option, index}
        <!-- content here -->
        <div class="radio-button">
          <input
            type="radio"
            id="{name}.{option}"
            value={option}
            {name}
            bind:group={value}
          />
          <label for="{name}.{option}">{option.replaceAll("_", " ")}</label>
        </div>
        {#if index !== options.length - 1}
          <div class="vertical-splitter" />
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  select {
    background-color: var(--reverse-accent);

    padding: 5px;
    border-radius: 5px;
    outline: none;
    border: none;
  }

  select:focus {
    border: none;
    outline: none;
  }

  #container {
    align-items: center;
    gap: 5px;
  }

  p {
    margin: 5px;
    font-size: 17px;
  }

  .radio-button {
    cursor: pointer;
  }

  /* Hide the actual radio button input */
  .radio-button input {
    display: none;
  }

  /* Style the label to look like a button */
  .radio-button label {
    display: inline-block;
    padding: 8px 16px;
    /* transition: all 0.3s; */
    font-size: 16px;
  }

  /* Style the selected label */
  .radio-button input:checked + label {
    background-color: var(--accent-color);
    /* color: #007aff; */
    /* border: 1px solid #007aff; */
  }

  #radiogroup {
    overflow: hidden;
    border-radius: 10px;
    background-color: var(--reverse-accent);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .vertical-splitter {
    z-index: 10;

    height: 20px;
    width: 1.5px;
    background-color: #3c3c3c;
    margin: -0.75px;
    border-radius: 10px;
  }
</style>
