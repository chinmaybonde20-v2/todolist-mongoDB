import { mount } from "@vue/test-utils";
import ContactUs from "../../src/views/ContactPage.vue"; // Adjust the path as needed

describe("ContactUs.vue", () => {
  it("renders the component", () => {
    const wrapper = mount(ContactUs);
    expect(wrapper.exists()).toBe(true);
  });
  it("validates input on blur", async () => {
    const wrapper = mount(ContactUs);

    // Simulate user input and blur event with an empty input
    await wrapper.setData({ inputValue: "" });
    await wrapper.find("input").trigger("blur");

    // Log the actual text content
    console.log(wrapper.find("p").text());

    // Ensure validation error is displayed
    expect(wrapper.find("p").text()).toBe("Input Field cannot be blank.");

    // Update the input value to a non-empty value and trigger blur again
    await wrapper.setData({ inputValue: "Hello" });
    await wrapper.find("input").trigger("blur");

    // Log the actual text content
    console.log(wrapper.find("p").text());

    // Ensure validation error is not displayed
    expect(wrapper.find("p").exists()).toBe(false);
  });
});
