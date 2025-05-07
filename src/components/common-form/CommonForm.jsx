import React from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import CommonButton from "../common-button/CommonButton";

const CommonForm = ({ formControls = [], form, btnText, handleSubmit }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {formControls?.length > 0
          ? formControls.map((controlItem, index) => (
              <FormField
                key={index}
                control={form.control}
                name={controlItem.id}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="text-[16px]">
                        {controlItem.label}
                      </FormLabel>
                      {controlItem.componentType === "input" ? (
                        <FormControl>
                          <Input
                            id={controlItem.id}
                            type={controlItem.type}
                            {...field}
                            value={field.value}
                            placeholder={controlItem.placeholder}
                            className="w-full rounded h-[50px] border-none text-black bg-gray-200 text-[16px] outline-none drop-shadow-sm transition-all duration-300 ease-in-out focus:bg-gray-100 focus:drop-shadow-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 mb-3"
                          />
                        </FormControl>
                      ) : controlItem.componentType === "select" ? (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              {field.value ? (
                                <SelectValue
                                  placeholder={controlItem.placeholder}
                                />
                              ) : (
                                "Select"
                              )}
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {controlItem.options.map((optionItem, index) => (
                              <SelectItem value={optionItem.id} key={index}>
                                {optionItem.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : null}
                    </FormItem>
                  );
                }}
              />
            ))
          : null}
        <div className="mt-5 flex justify-center mb-3 border">
          <CommonButton type={"submit"} buttonText={btnText} />
        </div>
      </form>
    </Form>
  );
};

export default CommonForm;
