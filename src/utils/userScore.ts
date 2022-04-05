const levelMinXp: number[] = [
	0,
	0,
	60,
	120,
	200,
	300,
	450,
	750,
	1125,
	1650,
	2250,
	3000,
	3900,
	4900,
	6000,
	7500,
	9000,
	10500,
	12000,
	13500,
	15000,
	17000,
	19000,
	22500,
	26000,
	30000,
];

export const difficultyScore: {
    [key: string]: number,
} = {
    EASY: 100,
    MEDIUM: 200,
    HARD: 300
}

export const level = (xp: number) => {
	let currentLevel = 0;
	for(let i = 0;i < levelMinXp.length;++i){
		if(levelMinXp[i] <= xp){
			currentLevel = i
		}
	}
	return currentLevel;
}
