import { useEffect, useState } from "react";
import { api } from "../api";
import type { GalleryItem, Player } from "../../shared/data";

export type Scene = {
  kind: "squad" | "gallery";
  title: string;
  tag: string;
  bg: string;
  img?: string;
  players?: Player[];
};

export function useCinematicScenes(cap?: number): Scene[] {
  const [scenes, setScenes] = useState<Scene[]>([]);

  useEffect(() => {
    let alive = true;
    Promise.all([api.gallery(), api.players()])
      .then(([gallery, players]) => {
        if (!alive) return;
        const lineup: Scene = {
          kind: "squad",
          title: "Five Hunters, One Nation",
          tag: "The Squad",
          bg: "linear-gradient(135deg, #0f2f7a, #1d4ed8)",
          players: players.slice(0, 5),
        };
        const shots: Scene[] = gallery
          .filter((g: GalleryItem) => g.img)
          .map((g: GalleryItem) => ({
            kind: "gallery",
            title: g.title,
            tag: g.tag,
            bg: g.bg,
            img: g.img,
          }));
        const list = [lineup, ...shots];
        setScenes(cap ? list.slice(0, cap) : list);
      })
      .catch(() => {
        /* leave empty if data can't be loaded */
      });
    return () => {
      alive = false;
    };
  }, [cap]);

  return scenes;
}
