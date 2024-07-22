"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer (to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const userId = session.user.id;


    if(!userId){ 
        return {
            message: "Not logged in"
        }
    }

    const toUser = await prisma.user.findUnique({
        where: {
            number: to
        }
    })

    if(!toUser){
        return {
            message: "Recipient not found"
        }
    }

    prisma.$transaction(async (tx) => {

        const balance = await tx.balance.findUnique({
            where: {
                userId: Number(userId)
            }
        })

        if(!balance || balance.amount < amount){
            throw new Error('Insufficient funds');
        }

       await tx.balance.update({
        where: {
            userId: Number(userId)
        },
        data: { amount: { decrement: amount } },
       })

       await tx.balance.update({
        where: {
            userId: Number(toUser.id)
        },
        data: {
            amount: {increment: amount}
        }
       })
    })


}