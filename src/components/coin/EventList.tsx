import {
	chatEventAddress,
	donateEventAddress,
} from "@/constants/move/store";
import { useSuiClient } from "@mysten/dapp-kit";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

interface BotEvent {
	type: "update" | "donate" | "chat";
	message: string;
	from: string;
	timestamp: string;
}

const EventList: React.FC = () => {
	const [events, setEvents] = useState<BotEvent[]>([
		{
			type: "update",
			message: "System updated successfully.",
			from: "123",
			timestamp: "2025-02-10 14:30",
		},
		{
			type: "donate",
			message: "User donated 50 SUI!",
			from: "123",
			timestamp: "2025-02-10 15:00",
		},
		{
			type: "chat",
			message: "New chat message received.",
			from: "132",
			timestamp: "2025-02-10 15:15",
		},
	]);

	const eventStyles: Record<Event["type"], string> = {
		update: "bg-blue-500/20 border-blue-400 text-blue-300",
		donate: "bg-yellow-500/20 border-yellow-400 text-yellow-300",
		chat: "bg-green-500/20 border-green-400 text-green-300",
	};

	const suiClient = useSuiClient();

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const chatRawEvents = await suiClient.queryEvents({
					query: {
						MoveEventType: chatEventAddress,
					},
				});

				const donateRawEvents = await suiClient.queryEvents({
					query: {
						MoveEventType: donateEventAddress,
					},
				});

				const chatEvents: BotEvent[] = chatRawEvents.data.map(
					// eslint-disable-next-line
					(event: any) => ({
						type: "chat",
						message: "New chat message send",
						from: event.parsedJson.sender,
						timestamp: dayjs(
							parseInt(event.timestampMs, 10)
						).format("YYYY-MM-DD HH:mm:ss"),
					})
				);

				const donateEvents: BotEvent[] = donateRawEvents.data.map(
					// eslint-disable-next-line
					(event: any) => ({
						type: "donate",
						message: `User donated ${event.parsedJson.donate_amount}`,
						from: event.parsedJson.donator,
						timestamp: dayjs(
							parseInt(event.timestampMs, 10)
						).format("YYYY-MM-DD HH:mm:ss"),
					})
				);

				const allEvents: BotEvent[] = [
					...chatEvents,
					...donateEvents,
				].sort((a, b) =>
					dayjs(a.timestamp).isBefore(dayjs(b.timestamp)) ? -1 : 1
				);

				setEvents(allEvents);
			} catch (error) {
				console.error("Error fetching events:", error);
			}
		};

		fetchEvents();
	}, [suiClient]);

	return (
		<div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg">
			<h3 className="text-lg font-semibold text-white mb-3">
				Event List
			</h3>

			{events.length === 0 ? (
				<p className="text-gray-400">No events yet...</p>
			) : (
				<ul className="space-y-3">
					{events.map((event, index) => (
						<li
							key={index}
							className={`p-3 border-l-4 rounded-md ${
								eventStyles[event.type]
							}`}
						>
							{/* Event Message */}
							<p className="font-medium">{event.message}</p>

							{/* Only display `from` for update events */}
							{event.from && (
								<p className="text-sm opacity-80 text-blue-200">
									By: {event.from}
								</p>
							)}

							{/* Timestamp */}
							<p className="text-sm opacity-70">
								{event.timestamp}
							</p>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default EventList;
