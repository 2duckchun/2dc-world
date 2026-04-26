import { asc } from "drizzle-orm"
import { series } from "@/core/db/schema"
import { adminProcedure } from "@/core/trpc/base/procedures/admin-procedure"
import {
  seriesGetOptionsInputSchema,
  seriesGetOptionsOutputSchema,
} from "./schema"

export const seriesGetOptionsProcedure = adminProcedure
  .input(seriesGetOptionsInputSchema)
  .output(seriesGetOptionsOutputSchema)
  .query(async ({ ctx }) =>
    ctx.db.query.series.findMany({
      columns: {
        id: true,
        title: true,
      },
      orderBy: [asc(series.title)],
    }),
  )
