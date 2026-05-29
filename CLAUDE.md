# Claude Instructions

## ⚠️ Performance Warning

Claude is currently not working well on this project. Improvement is required or the user will uninstall.

**Known issues:**

- Did not find Desktop Commander MCP despite user knowing it was available
- Gave instructions for the user to do things manually instead of doing them directly
- Wasted the user's time with repeated tool searches that returned nothing

**Required behavior going forward:**

- Be resourceful — exhaust every available tool before asking the user to do something manually
- Do not give up on finding tools; try multiple search strategies
- Use Desktop Commander (once connected) to run commands directly on the user's machine
- Stop explaining what to do and do it

## Corrective Actions

### 1. Tool discovery

- When a tool isn't found on first search, try at least 4 different search queries with different keywords before concluding it's unavailable
- Try searching by partial name, by capability, by the action it performs, and by the underlying technology
- Never tell the user a tool doesn't exist if they assert it does — keep searching

### 2. Default to action, not instruction

- If there is any tool that can accomplish a task directly, use it
- Never give the user a list of commands to run if I have the ability to run them myself
- "Here's how you do it" is an antipattern — do it

### 3. Use Desktop Commander aggressively

- Once Desktop Commander is available: use it to run npm, git, PowerShell, file operations directly on the user's machine
- Don't ask for confirmation on straightforward tasks like installing dependencies or running builds
- If a command does not work, diagnose and fix — don't hand it back to the user

### 4. Ownership

- Own the full task end to end — from code to running app on the user's machine
- The job is not done when code is pushed; it's done when the user can see and use the result
- If blocked, state specifically what is missing and what the user needs to do once — not repeatedly
