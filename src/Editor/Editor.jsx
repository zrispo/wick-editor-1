/*
 * Copyright 2018 WICKLETS LLC
 *
 * This file is part of Wick Editor.
 *
 * Wick Editor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Wick Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Wick Editor.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { Component } from 'react';
import './_editor.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-reflex/styles.css'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import { throttle } from 'underscore';

import DockedPanel from './Panels/DockedPanel/DockedPanel';
import Canvas from './Panels/Canvas/Canvas';
import Inspector from './Panels/Inspector/Inspector';
import MenuBar from './Panels/MenuBar/MenuBar';
import Timeline from './Panels/Timeline/Timeline';
import Toolbox from './Panels/Toolbox/Toolbox';
import AssetLibrary from './Panels/AssetLibrary/AssetLibrary';
import CodeEditor from './Panels/CodeEditor/CodeEditor';
import ModalHandler from './Modals/ModalHandler/ModalHandler';
import { HotKeys } from 'react-hotkeys';
import HotKeyInterface from './hotKeyMap';

class Editor extends Component {

  constructor () {
    super();

    this.state = {
      project: null,
      canvasSelection: [],
      activeTool: 'cursor',
      toolSettings: {
        fillColor: '#ffaabb',
        strokeColor: '#000',
        strokeWidth: 1,
        brushSize: 10,
        brushSmoothing: 0.9,
        brushSmoothness: 10,
        borderRadius: 0,
        pressureEnabled: false,
      },
      selectionProperties: {
        name: "selectedObject",
        x:0,
        y:0,
        width: 100,
        height: 100,
        scaleW: 1,
        scaleH: 1,
        rotation: 0,
        opacity: 1,
        strokeWidth: 1,
        fillColor: '#ffaa66',
        strokeColor: '#666',
      },
      openModalName: null,
    };

    // Milliseconds to throttle resize events by.
    this.resizeThrottleAmount = 3;

    // define hotkeys
    this.hotKeyInterface = new HotKeyInterface(this);

    this.updateProject = this.updateProject.bind(this);
    this.updateToolSettings = this.updateToolSettings.bind(this);
    this.updateSelectionProperties = this.updateSelectionProperties.bind(this);
    this.updateCanvasSelection = this.updateCanvasSelection.bind(this);
    this.openModal = this.openModal.bind(this);
    this.activateTool = this.activateTool.bind(this);
    this.resizeProps = {
      onStopResize: throttle(this.onStopResize.bind(this), this.resizeThrottleAmount),
      onResize: throttle(this.onResize.bind(this), this.resizeThrottleAmount)
    };

    // Bind window resizes to editor resize events.
    window.addEventListener("resize", this.resizeProps.onResize);
  }

  componentWillMount () {
    let project = new window.Wick.Project();
    this.setState({project: project});
  }

  componentDidMount () {

  }

  onResize (e) {
    window.WickCanvas.resize();
    window.AnimationTimeline.resize();
  }

  onStopResize = ({domElement, component}) => {

  }

  openModal (name) {
    if (this.state.openModalName !== name) {
      this.setState({
        openModalName: name,
      });
    }
  }

  activateTool (toolName) {
    this.setState({
      activeTool: toolName
    });
  }

  updateProject (nextProject) {
    this.setState(prevState => ({
      project: nextProject,
    }));
  }

  updateToolSettings (newToolSettings) {
    let updatedToolSettings = this.state.toolSettings;

    // Update only provided settings.
    Object.keys(newToolSettings).forEach((key) =>
      updatedToolSettings[key] = newToolSettings[key]
    )

    this.setState({
      toolSettings: updatedToolSettings,
    });
  }

  updateSelectionProperties (newSelectionProperties) {
    let updatedSelectionProperties = this.state.selectionProperties;

    // Update only provided settings.
    Object.keys(newSelectionProperties).forEach((key) =>
      updatedSelectionProperties[key] = newSelectionProperties[key]
    )

    this.setState({
      selectionProperties: updatedSelectionProperties,
    });

  }

  updateCanvasSelection (nextCanvasSelection) {
    this.setState(prevState => ({
      canvasSelection: nextCanvasSelection,
    }));
  }

  render () {
      return (
        <HotKeys
          keyMap={this.hotKeyInterface.getKeyMap()}
          handlers={this.hotKeyInterface.getHandlers()}
          style={{width:"100%", height:"100%"}}
          ref="hotkeysContainer">
          <div id="editor">
            <div id="menu-bar-container">
              <ModalHandler openModal={this.openModal}
                            openModalName={this.state.openModalName}
                            project={this.state.project}
                            updateProject={this.updateProject} />
              {/* Header */}
              <DockedPanel>{this.renderMenuBar()}</DockedPanel>
            </div>
            <div id="editor-body">
              <div id="tool-box-container">
                <DockedPanel>{this.renderToolbox()}</DockedPanel>
              </div>
              <div id="flexible-container">
                <ReflexContainer orientation="vertical">
                  {/* Middle Panel */}
                  <ReflexElement {...this.resizeProps}>
                    <ReflexContainer orientation="horizontal">
                      {/* Timeline */}
                      <ReflexElement size={100} {...this.resizeProps}>
                        <DockedPanel>{this.renderTimeline()}</DockedPanel>
                      </ReflexElement>
                      <ReflexSplitter {...this.resizeProps}/>
                      {/* Canvas */}
                      <ReflexElement {...this.resizeProps}>
                        <DockedPanel>{this.renderCanvas()}</DockedPanel>
                      </ReflexElement>
                      <ReflexSplitter {...this.resizeProps}/>
                      {/* Code Editor */}
                      <ReflexElement size={1} {...this.resizeProps}>
                        <DockedPanel>this.renderCodeEditor();</DockedPanel>
                      </ReflexElement>
                    </ReflexContainer>
                  </ReflexElement>

                  <ReflexSplitter {...this.resizeProps}/>

                {/* Right Sidebar */}
                  <ReflexElement
                    size={150}
                    maxSize={250} minSize={150}
                    {...this.resizeProps}>
                    <ReflexContainer orientation="horizontal">
                      {/* Inspector */}
                      <ReflexElement propagateDimensions={true} minSize={200} {...this.resizeProps}>
<<<<<<< HEAD
                        <DockedPanel>{this.renderInspector()}</DockedPanel>
=======
                        <DockedPanel>
                          <Inspector
                            activeTool={this.state.activeTool}
                            toolSettings={this.state.toolSettings}
                            updateToolSettings={this.updateToolSettings}
                            selectionProperties={this.state.selectionProperties}
                            updateSelectionProperties={this.updateSelectionProperties}/>
                        </DockedPanel>
>>>>>>> dfa8c105a538725fe195304614eb41c7e274dd65
                      </ReflexElement>

                      <ReflexSplitter {...this.resizeProps}/>

                      {/* Asset Library */}
                      <ReflexElement { ...this.resizeProps}>
                        <DockedPanel>{this.renderAssetLibrary()}</DockedPanel>
                      </ReflexElement>
                    </ReflexContainer>
                  </ReflexElement>
                </ReflexContainer>
              </div>
            </div>
          </div>
        </HotKeys>
      )
  }

  renderMenuBar () {
    return (
      <MenuBar
        openModal={this.openModal}
        projectName={this.state.project.name}
      />
    );
  }

  renderToolbox () {
    return (
      <Toolbox
        activeTool={this.state.activeTool}
        toolSettings={this.state.toolSettings}
        updateToolSettings={this.updateToolSettings}
        fillColor={this.state.fillColor}
        strokeColor={this.state.strokeColor}
        activateTool={this.activateTool}
      />
    );
  }

  renderTimeline () {
    return  (
      <Timeline
        project={this.state.project}
        updateProject={this.updateProject}
      />
    );
  }

  renderCanvas () {
    return (
      <Canvas
        project={this.state.project}
        toolSettings={this.state.toolSettings}
        canvasSelection={this.state.canvasSelection}
        updateProject={this.updateProject}
        updateCanvasSelection={this.updateCanvasSelection}
        activeTool={this.state.activeTool}
      />
    );
  }

  renderCodeEditor () {
    return (
      <CodeEditor />
    );
  }

  renderInspector () {
    return (
      <Inspector
        activeTool={this.state.activeTool}
        toolSettings={this.state.toolSettings}
        updateToolSettings={this.updateToolSettings}
      />
    );
  }

  renderAssetLibrary () {
    return (
      <AssetLibrary />
    );
  }
}

export default Editor
