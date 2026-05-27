export interface StreamWentLiveEvent {
  event: "stream_went_live";
  data: {
    streamId: string;
    streamerId: string | null;
    startedAt: string;
  };
}

export interface GenericNotificationEvent {
  event: "notification";
  data: unknown;
}

export type NotificationEvent = StreamWentLiveEvent | GenericNotificationEvent;
