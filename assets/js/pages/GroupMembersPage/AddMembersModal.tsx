import React from "react";
import { useTranslation } from "react-i18next";

import Modal from "./Modal";

import Avatar from "@/components/Avatar";
import Button from "@/components/Button";

import PeopleSearch, { Option, Person } from "@/components/PeopleSearch";
import * as Groups from "@/graphql/Groups";
import client from "@/graphql/client";
import * as Icons from "@tabler/icons-react";

interface ContextDescriptor {
  selected: Option[];
  add: (person: Option) => void;
  remove: (id: string) => void;
}

const Context = React.createContext<ContextDescriptor | null>(null);

export default function AddMembersModal({ groupId, onSubmit, members }) {
  const { t } = useTranslation();

  const [selected, setSelectedList] = React.useState<Option[]>([]);
  const [isModalOpen, setIsModalOpen]: [boolean, any] = React.useState(false);

  const add = (selection: Option) => setSelectedList([...selected, selection]);
  const remove = (id: string) => {
    setSelectedList(selected.filter((p) => p.value !== id));
  };

  const search = async (value: string) => {
    let result = await Groups.listPotentialGroupMembers(client, {
      variables: {
        groupId,
        query: value,
        excludeIds: selected.map((p) => p.value),
        limit: 10,
      },
    });

    return result.data.potentialGroupMembers;
  };

  const submit = async () => {
    await client.mutate({
      mutation: Groups.ADD_MEMBERS,
      variables: {
        groupId,
        personIds: selected.map((s) => s.person.id),
      },
    });

    setIsModalOpen(false);
    setSelectedList([]);
    onSubmit();
  };

  const openModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);

  return (
    <Context.Provider value={{ selected, add, remove }}>
      <Button variant="success" onClick={openModal} data-test-id="add-group-members">
        Add Members
      </Button>

      <Modal title={t("forms.add_group_members_title")} isOpen={isModalOpen} hideModal={hideModal}>
        <SearchField
          onSelect={add}
          loader={search}
          placeholder={t("forms.add_group_members_search_placeholder")}
          alreadySelected={selected.map((p) => p.value) + members.map((p: Person) => p.id)}
        />

        <div className="flex flex-col gap-2 mt-4">
          <PeopleList />
        </div>

        <div className="mt-4">
          <Button variant="success" onClick={submit} data-test-id="submit-group-members">
            {t("forms.add_group_members_button")}
          </Button>
        </div>
      </Modal>
    </Context.Provider>
  );
}

function PeopleList() {
  const { selected } = React.useContext(Context) as ContextDescriptor;

  return (
    <div className="flex flex-col gap-2">
      {selected.map((s) => (
        <PeopleListItem selected={s} />
      ))}
    </div>
  );
}

function PeopleListItem({ selected }: { selected: Option }): JSX.Element {
  const { remove } = React.useContext(Context) as ContextDescriptor;

  return (
    <div className="px-2 py-1 bg-dark-5 rounded flex justify-between items-center" key={selected.value}>
      <div className="flex items-center gap-2">
        <Avatar person={selected.person} size="tiny" />
        <p>
          {selected.person.fullName} &middot; {selected.person.title}
        </p>
      </div>

      <RemoveIcon onClick={() => remove(selected.value)} />
    </div>
  );
}

function SearchField({ onSelect, loader, placeholder, alreadySelected }) {
  const [selected, setSelected] = React.useState(null);

  const onChange = (value: Person | null): void => {
    onSelect(value);
    setSelected(null);
  };

  const filterOptions = (candidate: any): boolean => {
    return !alreadySelected.includes(candidate.value);
  };

  return (
    <PeopleSearch
      placeholder={placeholder}
      value={selected}
      onChange={onChange}
      loader={loader}
      filterOption={filterOptions}
    />
  );
}

function RemoveIcon({ onClick }) {
  return (
    <div className="hover:cursor-pointer text-white-3 hover:text-white-1" onClick={onClick}>
      <Icons.IconX size={20} />
    </div>
  );
}