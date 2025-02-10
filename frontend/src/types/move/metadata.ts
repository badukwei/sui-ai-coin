export interface IMetadata {
	symbol: string;
	name: string;
	description: string;
	imageUrl: string;
	coinAddress?: string;
}

export interface MetadataWithTime extends IMetadata {
	timestamp: number;
}

