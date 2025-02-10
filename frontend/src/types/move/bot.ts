// export interface BotContent {
// 	dataType: "moveObject";
// 	type: string;
// 	hasPublicTransfer: boolean;
// 	fields: BotInfo;
// }

export interface BotInfo {
	bot_id: string;
	bot_json: string;
	ca: string;
	id: { id: string };
	name: string;
	symbol: string;
	token_reserve: string;
}
