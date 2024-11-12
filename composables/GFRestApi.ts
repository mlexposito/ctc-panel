import axios from "axios";
const consumer_key = "ck_febebf8293788a3bcd166b352cb83f09b1c52619";
const consumer_secret = "cs_079de899e7316232bc472e4c5f7371e77097ed72";
const GF_BaseUrl = "https://compostelatangoclub.es/wp-json/gf/v2/";
const FORM_ID = "2";

export const useGFRestApi = () => {
  const fetchFormEntries = async (formId = FORM_ID): Promise<any> => {
    const { data } = await axios.get(
      `${GF_BaseUrl}forms/${formId}/entries?paging[page_size]=500`,
      {
        headers: {
          Authorization: `Basic ${btoa(`${consumer_key}:${consumer_secret}`)}`,
        },
      }
    );
    return data;
  };

  const fetchEntry = async (entryId: number): Promise<any> => {
    const { data } = await axios.get(`${GF_BaseUrl}entries/${entryId}`, {
      headers: {
        Authorization: `Basic ${btoa(`${consumer_key}:${consumer_secret}`)}`,
      },
    });
    return data;
  };

  const updateEntry = async (entryId: number, data: any): Promise<any> => {
    const { data: entry } = await axios.put(
      `${GF_BaseUrl}entries/${entryId}`,
      data,
      {
        headers: {
          Authorization: `Basic ${btoa(`${consumer_key}:${consumer_secret}`)}`,
        },
      }
    );
    return entry;
  };

  const deleteEntry = async (entryId: number): Promise<any> => {
    const { data } = await axios.delete(`${GF_BaseUrl}entries/${entryId}`, {
      headers: {
        Authorization: `Basic ${btoa(`${consumer_key}:${consumer_secret}`)}`,
      },
    });
    return data;
  };

  const sendNotification = async (
    entryId: number,
    notification: string
  ): Promise<any> => {
    await axios.post(
      `${GF_BaseUrl}entries/${entryId}/notifications?_notifications=${notification}`,
      {},
      {
        headers: {
          Authorization: `Basic ${btoa(`${consumer_key}:${consumer_secret}`)}`,
        },
      }
    );
  };

  return {
    fetchFormEntries,
    fetchEntry,
    updateEntry,
    deleteEntry,
    sendNotification,
  };
};
