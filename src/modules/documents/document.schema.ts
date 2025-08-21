import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ResearchDocumentDocument = HydratedDocument<ResearchDocument>;

@Schema({ timestamps: true })
export class ResearchDocument {
  @Prop({ required: true })
  projectId: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const ResearchDocumentSchema = SchemaFactory.createForClass(ResearchDocument);
