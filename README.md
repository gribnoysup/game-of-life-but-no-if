# Game of Life but no ifs

<p align="center">
	<img width="353" style="max-width:100%" src="./demo.gif" alt="Conway's Game of Life demo: 'cells' waking up and falling asleep">
	<br>
</p>

Cell lifecycle logic without conditions and hash maps, just math and bitwise operators:

```js
Math.floor(((numberOfActiveAdjacentCells | currentState) ^ 12) / 15);
```
