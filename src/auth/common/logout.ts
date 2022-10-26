import { Customer } from "../../customers/entities/customer.entity";
import { Response } from "express";

export const logout = async (person, res: Response) => {
  try {
    const customer = await Customer.findOne({
      where: { email: person.email, id: person.id }
    });
    customer.accessToken = null;
    await customer.save();
    res
      .clearCookie("jwt", {
        secure: false,
        domain: "localhost",
        httpOnly: true
      })
      .json({
        status: true,
        message: "Successfully logout"
      });
  } catch (e) {
    res.json({
      success: false,
      message: e.message
    });
  }
};
