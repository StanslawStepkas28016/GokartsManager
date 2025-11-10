import {ActionFunction, Form, useActionData, useNavigate} from "react-router";
import {axiosInstance} from "../lib/axios";
import {useEffect} from "react";
import {ActionData} from "../types/types";

export const action: ActionFunction = async ({request}) => {
	// Extract the session token from shopify's frontend to shopify's backend (implicitly added).
	const authHeader = request.headers.get("Authorization");
	const sessionToken = authHeader?.replace("Bearer ", "");

	// Extract the form data from the request.
	const formData = await request.formData();

	try {
		await axiosInstance.post("gokarts", {
				number: formData.get("number"),
				horsePower: formData.get("horsePower"),
				rideTime: formData.get("rideTime"),
				additionalNote: formData.get("additionalNote")
			},
			{
				headers: {
					'Authorization': `Bearer ${sessionToken}`,
				}
			}
		);
		return {
			success: true,
			message: "Successfully added a gokart."
		} as ActionData;
	} catch (e: any) {
		console.error(e);
		return {
			success: false,
			error: e.response.data.ExceptionMessage || "Failed to add gokart."
		} as ActionData;
	}
};

export default function AdditionalPage() {
	const actionData = useActionData<ActionData>();
	const navigate = useNavigate();

	useEffect(() => {
		if (actionData?.success) {
			const timer = setTimeout(() => {
				navigate("/app");
			}, 2000);

			return () => clearTimeout(timer);
		}
	}, [actionData, navigate]);

	return (
		<s-page heading="Add a gokart">
			<s-section heading="Instructions">
				This page lets you add gokarts which will be visible to client and in the See all gokarts section of
				the <b>GokartsApp</b>.
			</s-section>

			<Form method="post">
				<s-stack gap="base large" alignItems="center" padding="small large-500 small large-500">
					<s-number-field
						name="number"
						label="Number on gokart"
						details="Number visible on the gokarts sticker."
						required
					/>

					<s-number-field
						name="horsePower"
						label="Horsepower"
						details="Horsepower of the specified gokart."
						required
					/>

					<s-number-field
						name="rideTime"
						label="Ride time"
						details="Time at which the gokart entered."
						required
					/>

					<s-text-area
						name="additionalNote"
						label="Additional note"
						required
					/>

					<s-stack padding="small-100">
						<s-button variant="primary" type="submit">
							Submit
						</s-button>
					</s-stack>
				</s-stack>

			</Form>

			<s-stack alignItems="center">
				{actionData?.success && (
					<s-banner tone="success" dismissible>
						{actionData.message}
					</s-banner>
				)}

				{actionData && !actionData.success && (
					<s-banner tone="critical" dismissible>
						{actionData.error}
					</s-banner>
				)}
			</s-stack>
		</s-page>
	);
}
