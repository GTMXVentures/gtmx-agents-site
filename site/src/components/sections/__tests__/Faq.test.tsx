import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Faq } from "@/components/sections/Faq";
import { FAQS } from "@/data/faq";

describe("Faq", () => {
	it("renders every question", () => {
		render(<Faq />);
		for (const item of FAQS) {
			expect(screen.getByText(item.question)).toBeInTheDocument();
		}
	});

	it("opens the first answer by default", () => {
		render(<Faq />);
		expect(screen.getByText(FAQS[0].answer).closest("details")).toHaveAttribute("open");
	});

	it("keeps only one answer open at a time", async () => {
		const user = userEvent.setup();
		render(<Faq />);

		await user.click(screen.getByText(FAQS[2].question));

		expect(screen.getByText(FAQS[2].answer).closest("details")).toHaveAttribute("open");
		expect(screen.getByText(FAQS[0].answer).closest("details")).not.toHaveAttribute("open");
	});
});
