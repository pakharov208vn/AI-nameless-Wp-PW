import { google } from '@ai-sdk/google'
import { Experimental_LanguageModelV1Middleware, generateText, experimental_wrapLanguageModel as wrapLanguageModel } from 'ai'

export const customMiddleware: Experimental_LanguageModelV1Middleware = {}

export const geminiProModel = wrapLanguageModel({
  model: google('gemini-1.5-pro-002'),
  middleware: customMiddleware,
})

export async function POST() {
  // const session = await auth();

  // if (!session) {
  //   return new Response("Unauthorized", { status: 401 });
  // }

  // const coreMessages = convertToCoreMessages(messages).filter(
  //   (message) => message.content.length > 0,
  // );

  // const result = await streamText({
  //   model:,
  //   system: `\n
  //       - you help users book flights!
  //       - keep your responses limited to a sentence.
  //       - DO NOT output lists.
  //       - after every tool call, pretend you're showing the result to the user and keep your response limited to a phrase.
  //       - today's date is ${new Date().toLocaleDateString()}.
  //       - ask follow up questions to nudge user into the optimal flow
  //       - ask for any details you don't know, like name of passenger, etc.'
  //       - C and D are aisle seats, A and F are window seats, B and E are middle seats
  //       - assume the most popular airports for the origin and destination
  //       - here's the optimal flow
  //         - search for flights
  //         - choose flight
  //         - select seats
  //         - create reservation (ask user whether to proceed with payment or change reservation)
  //         - authorize payment (requires user consent, wait for user to finish payment and let you know when done)
  //         - display boarding pass (DO NOT display boarding pass without verifying payment)
  //       '
  //     `,
  //   messages: coreMessages,
  //   tools: {
  //     getWeather: {
  //       description: "Get the current weather at a location",
  //       parameters: z.object({
  //         latitude: z.number().describe("Latitude coordinate"),
  //         longitude: z.number().describe("Longitude coordinate"),
  //       }),
  //       execute: async ({ latitude, longitude }) => {
  //         const response = await fetch(
  //           `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
  //         );

  //         const weatherData = await response.json();
  //         return weatherData;
  //       },
  //     },
  //     displayFlightStatus: {
  //       description: "Display the status of a flight",
  //       parameters: z.object({
  //         flightNumber: z.string().describe("Flight number"),
  //         date: z.string().describe("Date of the flight"),
  //       }),
  //       execute: async ({ flightNumber, date }) => {
  //         const flightStatus = await generateSampleFlightStatus({
  //           flightNumber,
  //           date,
  //         });

  //         return flightStatus;
  //       },
  //     },
  //     searchFlights: {
  //       description: "Search for flights based on the given parameters",
  //       parameters: z.object({
  //         origin: z.string().describe("Origin airport or city"),
  //         destination: z.string().describe("Destination airport or city"),
  //       }),
  //       execute: async ({ origin, destination }) => {
  //         const results = await generateSampleFlightSearchResults({
  //           origin,
  //           destination,
  //         });

  //         return results;
  //       },
  //     },
  //     selectSeats: {
  //       description: "Select seats for a flight",
  //       parameters: z.object({
  //         flightNumber: z.string().describe("Flight number"),
  //       }),
  //       execute: async ({ flightNumber }) => {
  //         const seats = await generateSampleSeatSelection({ flightNumber });
  //         return seats;
  //       },
  //     },
  //     createReservation: {
  //       description: "Display pending reservation details",
  //       parameters: z.object({
  //         seats: z.string().array().describe("Array of selected seat numbers"),
  //         flightNumber: z.string().describe("Flight number"),
  //         departure: z.object({
  //           cityName: z.string().describe("Name of the departure city"),
  //           airportCode: z.string().describe("Code of the departure airport"),
  //           timestamp: z.string().describe("ISO 8601 date of departure"),
  //           gate: z.string().describe("Departure gate"),
  //           terminal: z.string().describe("Departure terminal"),
  //         }),
  //         arrival: z.object({
  //           cityName: z.string().describe("Name of the arrival city"),
  //           airportCode: z.string().describe("Code of the arrival airport"),
  //           timestamp: z.string().describe("ISO 8601 date of arrival"),
  //           gate: z.string().describe("Arrival gate"),
  //           terminal: z.string().describe("Arrival terminal"),
  //         }),
  //         passengerName: z.string().describe("Name of the passenger"),
  //       }),
  //       execute: async (props) => {
  //         const { totalPriceInUSD } = await generateReservationPrice(props);
  //         const session = await auth();

  //         const id = generateUUID();

  //         if (session && session.user && session.user.id) {
  //           await createReservation({
  //             id,
  //             userId: session.user.id,
  //             details: { ...props, totalPriceInUSD },
  //           });

  //           return { id, ...props, totalPriceInUSD };
  //         } else {
  //           return {
  //             error: "User is not signed in to perform this action!",
  //           };
  //         }
  //       },
  //     },
  //     authorizePayment: {
  //       description:
  //         "User will enter credentials to authorize payment, wait for user to repond when they are done",
  //       parameters: z.object({
  //         reservationId: z
  //           .string()
  //           .describe("Unique identifier for the reservation"),
  //       }),
  //       execute: async ({ reservationId }) => {
  //         return { reservationId };
  //       },
  //     },
  //     verifyPayment: {
  //       description: "Verify payment status",
  //       parameters: z.object({
  //         reservationId: z
  //           .string()
  //           .describe("Unique identifier for the reservation"),
  //       }),
  //       execute: async ({ reservationId }) => {
  //         const reservation = await getReservationById({ id: reservationId });

  //         if (reservation.hasCompletedPayment) {
  //           return { hasCompletedPayment: true };
  //         } else {
  //           return { hasCompletedPayment: false };
  //         }
  //       },
  //     },
  //     displayBoardingPass: {
  //       description: "Display a boarding pass",
  //       parameters: z.object({
  //         reservationId: z
  //           .string()
  //           .describe("Unique identifier for the reservation"),
  //         passengerName: z
  //           .string()
  //           .describe("Name of the passenger, in title case"),
  //         flightNumber: z.string().describe("Flight number"),
  //         seat: z.string().describe("Seat number"),
  //         departure: z.object({
  //           cityName: z.string().describe("Name of the departure city"),
  //           airportCode: z.string().describe("Code of the departure airport"),
  //           airportName: z.string().describe("Name of the departure airport"),
  //           timestamp: z.string().describe("ISO 8601 date of departure"),
  //           terminal: z.string().describe("Departure terminal"),
  //           gate: z.string().describe("Departure gate"),
  //         }),
  //         arrival: z.object({
  //           cityName: z.string().describe("Name of the arrival city"),
  //           airportCode: z.string().describe("Code of the arrival airport"),
  //           airportName: z.string().describe("Name of the arrival airport"),
  //           timestamp: z.string().describe("ISO 8601 date of arrival"),
  //           terminal: z.string().describe("Arrival terminal"),
  //           gate: z.string().describe("Arrival gate"),
  //         }),
  //       }),
  //       execute: async (boardingPass) => {
  //         return boardingPass;
  //       },
  //     },
  //   },
  //   onFinish: async ({ responseMessages }) => {
  //     if (session.user && session.user.id) {
  //       try {
  //         await saveChat({
  //           id,
  //           messages: [...coreMessages, ...responseMessages],
  //           userId: session.user.id,
  //         });
  //       } catch (error) {
  //         console.error("Failed to save chat");
  //       }
  //     }
  //   },
  //   experimental_telemetry: {
  //     isEnabled: true,
  //     functionId: "stream-text",
  //   },
  // });

  const { text } = await generateText({
    model: geminiProModel,
    prompt: 'Bạn là giáo viên, hãy chấm bài giup tôi',
  })

  return new Response(JSON.stringify({ text }))
}
