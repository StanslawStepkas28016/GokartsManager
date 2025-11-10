import {ActionFunction, HeadersFunction, useFetcher, useLoaderData} from "react-router";
import {boundary} from "@shopify/shopify-app-react-router/server";
import {axiosInstance} from "../lib/axios";
import {ActionData, GokartsPaged} from "../types/types";

export const loader = async () => {
	try {
		const response = await axiosInstance
			.get("gokarts", {
				params: {
					page: 1,
					pageSize: 50
				}
			});

		return response.data as GokartsPaged;
	} catch (e) {
		console.error(e);
		return {
			items: [],
			page: 0,
			pageSize: 0,
			hasPreviousPage: false,
			hasNextPage: false,
			totalCount: -1
		} as GokartsPaged;
	}
};

export const action: ActionFunction = async ({request}) => {
	// Extract the session token from shopify's frontend to shopify's backend (implicitly added).
	const authHeader = request.headers.get("Authorization");
	const sessionToken = authHeader?.replace("Bearer ", "");

	// Extract the idGokart from submitted useFetcher form data.
	const formData = await request.formData();
	const idGokart = formData.get("idGokart");

	try {
		const response = await axiosInstance
			.delete(`gokarts/${idGokart}`, {
				headers: {
					'Authorization': `Bearer ${sessionToken}`,
				}
			});

		return {
			success: true,
			message: response.data.message
		} as ActionData;
	} catch (e: any) {
		console.error(e);
		return {
			success: false,
			error: e.response.data.ExceptionMessage || "Failed to delete gokart."
		} as ActionData;
	}
};

export default function Index() {
	const data = useLoaderData<typeof loader>();
	const fetcher = useFetcher<ActionData>();

	const deleteGokart = async (idGokart: string) => {
		if (confirm("Are you sure you want to delete this gokart?")) {
			await fetcher.submit(
				{idGokart},
				{method: "delete"}
			);
		}
	};

	return (
		<s-page heading="See all gokarts">
			<s-section heading="Instructions">
				This page lets you see the currently riding gokarts, those gokarts you visible here, will be
				displayed
				to
				clients which visit our website.
			</s-section>

			{
				data.totalCount===(-1) ?
					(
						<s-banner heading="Information" tone="critical" dismissible>
							Server error.
						</s-banner>
					):
					(
						data.items.length ? (
								<s-table>
									<s-table-header-row>
										<s-table-header>IdGokart</s-table-header>
										<s-table-header>Number</s-table-header>
										<s-table-header>Horsepower</s-table-header>
										<s-table-header>Ride time</s-table-header>
										<s-table-header>Ride start time</s-table-header>
										<s-table-header>Additional note</s-table-header>
										<s-table-header>Action</s-table-header>
									</s-table-header-row>
									<s-table-body>
										{data.items.map(item => (
											<s-table-row key={item.idGokart}>
												<s-table-cell>{item.idGokart}</s-table-cell>
												<s-table-cell>{item.number}</s-table-cell>
												<s-table-cell>{item.horsePower}</s-table-cell>
												<s-table-cell>{item.rideTime}</s-table-cell>
												<s-table-cell>{item.rideStartTime}</s-table-cell>
												<s-table-cell>{item.additionalNote}</s-table-cell>
												<s-table-cell>
													<s-button icon="delete" onClick={() => deleteGokart(item.idGokart)}/>
												</s-table-cell>
											</s-table-row>
										))}
									</s-table-body>
								</s-table>
							):
							(
								<s-banner heading="Information" tone="info" dismissible>
									There is no gokarts on the track, refer to the <b>
									<s-link href="/app/additional">Add a gokart</s-link>
								</b> section, in order
									to add one.
								</s-banner>
							)
					)
			}
		</s-page>
	);
}

export const headers: HeadersFunction = (headersArgs) => {
	return boundary.headers(headersArgs);
};
